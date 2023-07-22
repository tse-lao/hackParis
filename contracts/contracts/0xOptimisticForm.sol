// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {OptimisticOracleV3CallbackRecipientInterface} from "./interfaces/OptimisticOracleV3CallbackRecipientInterface.sol";
import {AncillaryData} from "@uma/core/contracts/common/implementation/AncillaryData.sol";
import {OptimisticOracleV3Interface} from "./interfaces/OptimisticOracleV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ISismoGlobalVerifier.sol";
import "./interfaces/ISismoStructs.sol";
import "./interfaces/IEscalationManager.sol";
import "./interfaces/ISender.sol";

contract OxOptimisticForm is Ownable, ERC1155, AccessControl, ISismoStructs {
    /// @dev Will be used to resolve disputes on the delivery
    // Goerli
    OptimisticOracleV3Interface private optimisticOracleV3;

    ISismoGlobalVerifier sismoVerifier;

    // TODO CUSTOM DIPUTE RESOLUTION MECHANISM
    IEscalationManager EscalationManager;

    ISender sender;

    bytes32 public constant Identifier = "YES_OR_NO_QUERY";

    struct OptimisticFormInfo {
        string formCID;
        uint256 mintPrice;
        uint256 formFunds;
        uint256 bondAmount;
        uint64 resolutionDays;
        address tokenTreasury;
        IERC20 bondCurrency;
        // address tokenGateAddress;
        // TokenGateType tokenGateType;
    }

    struct EventMetadata {
        string name;
        string description;
        string category;
        address[] requestAdmins;
        ClaimRequest[] claims;
    }

    struct Contribution {
        uint256 formID;
        address contributor;
        string contributionCID;
        uint256 rows;
    }

    struct assertionDetails {
        uint256 formID;
        bool assertionType;
    }

    enum TokenGateType {
        NONE,
        ERC20,
        ERC721,
        ERC1155
    }

    event FormRequestCreated(
        uint256 formID,
        string name,
        string description,
        string category,
        address[] admins
    );

    event ContributionAssertionCreated(uint256 formID, bytes32 assertionID);

    event DatasetTreasuryAssertionCreated(uint256 datasetID, bytes32 assertionID);

    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private formID;

    // Mapping to store Data requests information for each formID
    mapping(uint256 => OptimisticFormInfo) private optimisticFormInfo;

    mapping(uint256 => ClaimRequest[]) public formRequiredClaims;

    mapping(uint256 => bytes32[]) public formAssertions;

    mapping(bytes32 => assertionDetails) assertionInfo;

    mapping(bytes32 => Contribution) private assertionToContribution;

    
        // Goerli  0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB
        // Mumbai 0x263351499f82C107e540B01F0Ca959843e22464a
    constructor(ISismoGlobalVerifier _sismoVerifier, OptimisticOracleV3Interface _optimisticOracleV3,ISender _sender) ERC1155("") {
        
        sismoVerifier = _sismoVerifier;

        optimisticOracleV3 = _optimisticOracleV3;
        // To get used for sending funds on a contract viaCall
        sender = _sender;

    }

    // UMA OPERATIONS TODO
    // -----------------------------------------------------

    function setEscalationManager(IEscalationManager _EscalationManager) external onlyOwner {
        EscalationManager = _EscalationManager;
    }


    function optimisticFormRequest(
        OptimisticFormInfo memory _optimisticFormInfo,
        EventMetadata memory _eventMetadata
    ) public {
        formID.increment();
        uint256 _formID = formID.current();

        optimisticFormInfo[_formID] = _optimisticFormInfo;
        optimisticFormInfo[_formID].formFunds = 0;

        // TODO the request dataset workflow
        for (uint i = 0; i < _eventMetadata.claims.length; ) {
            formRequiredClaims[_formID].push(_eventMetadata.claims[i]);
            unchecked {
                ++i;
            }
        }

        for (uint i = 0; i < _eventMetadata.requestAdmins.length; ) {
            _grantRole(getFormAdminRole(_formID), _eventMetadata.requestAdmins[i]);
            unchecked {
                ++i;
            }
        }

        emit FormRequestCreated(
            _formID,
            _eventMetadata.name,
            _eventMetadata.description,
            _eventMetadata.category,
            _eventMetadata.requestAdmins
        );
    }

    function assertContribution(
        uint256 _formID,
        string calldata contributionCID,
        uint256 rows,
        bytes memory proofs
    ) public exists(_formID) {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];

        // Verifying Claims
        if (formRequiredClaims[_formID].length > 0) {
            sismoVerifier.verifySismoProof(proofs, formRequiredClaims[_formID]);
        }

        // UMA assert valid contribution
        assertContributionTruth(_formID, Contribution(_formID, msg.sender, contributionCID, rows));
    }

    function assertContributionTruth(
        uint256 _formID,
        Contribution memory contribution
    ) internal {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        bytes memory assertedClaim = abi.encodePacked(
            "Contribution on datasetID 0x",
            AncillaryData.toUtf8BytesUint(_formID),
            " with data : ",
            contribution.contributionCID,
            " with number of entries 0x",
            AncillaryData.toUtf8BytesUint(contribution.rows),
            " contributor address : 0x",
            AncillaryData.toUtf8BytesAddress(contribution.contributor)
        );

        IERC20 bondCurrency = form.bondCurrency;
        uint256 bondAmount = form.bondAmount;
        if (bondAmount > 0) {
            bondCurrency.approve(address(optimisticOracleV3), bondAmount);
        }
        bytes32 assertionID = optimisticOracleV3.assertTruth(
            assertedClaim,
            msg.sender,
            address(this), // callback recipient
            address(EscalationManager), // escalation manager
            form.resolutionDays,
            bondCurrency,
            bondAmount,
            Identifier,
            bytes32(block.chainid)
        );
        formAssertions[_formID].push(assertionID);

        assertionInfo[assertionID].formID = _formID;
        assertionInfo[assertionID].assertionType = false;
        assertionToContribution[assertionID] = contribution;
        emit ContributionAssertionCreated(_formID, assertionID);    
    }

    function assertDatasetTreasury(
        uint256 _formID,
        address tokenTreasury
    ) public exists(_formID) {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];

        bytes memory assertedClaim = abi.encodePacked(
            "Asserting on formID 0x",
            AncillaryData.toUtf8BytesUint(_formID),
            "the splitter treasury contract with address : 0x",
            AncillaryData.toUtf8BytesAddress(tokenTreasury),
            "to get used us the contributors revenue mechanism"
        );

        IERC20 bondCurrency = form.bondCurrency;
        uint256 bondAmount = form.bondAmount;

        if (bondAmount > 0) {
            bondCurrency.approve(address(optimisticOracleV3), bondAmount);
        }
        bytes32 assertionID = optimisticOracleV3.assertTruth(
            assertedClaim,
            msg.sender,
            address(this), // callback recipient
            address(EscalationManager), // escalation manager
            form.resolutionDays,
            bondCurrency,
            bondAmount,
            Identifier,
            bytes32(block.chainid)
        );

        formAssertions[_formID].push(assertionID);

        form.tokenTreasury = tokenTreasury;

        assertionInfo[assertionID].formID = _formID;
        assertionInfo[assertionID].assertionType = true; // TRUE <= Dataset Creation Assertion
        emit DatasetTreasuryAssertionCreated(_formID, assertionID);
    }

    /// @dev Dispute
    function disputeAssertion(bytes32 assertionId) external {
        require(isDisputeAllowed(assertionId, msg.sender), "anothorized");
        uint256 _formID = assertionInfo[assertionId].formID;

        IERC20 bondCurrency = optimisticFormInfo[_formID].bondCurrency;
        uint256 bondAmount = optimisticFormInfo[_formID].bondAmount;
        if (bondAmount > 0) {
            bondCurrency.approve(address(optimisticOracleV3), bondAmount);
        }
        optimisticOracleV3.disputeAssertion(assertionId, msg.sender);

    }

    // /// @dev UMA assertions callback
    function assertionResolvedCallback(
        bytes32 assertionId,
        bool assertedTruthfully
    ) external onlyOptimisticOracleV3 {}

    // /// @dev UMA dispute callback
    function assertionDisputedCallback(bytes32 assertionId) external view onlyOptimisticOracleV3 {}

    /**
     * @notice Reverts unless the configured Optimistic Oracle V3 is the caller.
     */
    modifier onlyOptimisticOracleV3() {
        require(msg.sender == address(optimisticOracleV3), "Not the Optimistic Oracle V3");
        _;
    }

    modifier exists(uint256 _formID) {
        require(_formID <= formID.current(), "non existed formID");
        _;
    }

    modifier onlyFormMembers(uint256 _datasetID) {
        require(formAccess(msg.sender, _datasetID), "anothorized request action");
        _;
    }

    function mint(uint256 _formID) external payable exists(_formID) {
        uint256 mintPrice = optimisticFormInfo[_formID].mintPrice;
        require(mintPrice == msg.value, "wrong price");
        address payable to = payable(optimisticFormInfo[_formID].tokenTreasury);
        // TODO GIVE SOME FEES TO A PAYMASTER SO THAT HE NEVER REMAINS WITHOUT FUNDS 
        if(to != address(0)){
            if (isContract(address(to))) {
                sender.sendViaCall{value: msg.value}(to);
            } else {
                to.transfer(msg.value);
            }
        }
        else{
            // When the trasury will be succesfully setted of we need to transafer 
            // those escrow funds to it
            optimisticFormInfo[_formID].formFunds += mintPrice;
        }

        _mint(msg.sender, _formID, 1, "");
    }

       // To get used with lighthouse to encrypt a dataset
    function hasAccess(address user, uint256 _formID) public view returns (bool) {
        return formAccess(user, _formID);
    }

    function formAccess(address user, uint256 _formID) public view returns (bool) {
        return
            hasRole(getFormAdminRole(_formID), user) ||
            hasRole(getFormContributorRole(_formID), user) || balanceOf(user, _formID) > 0;
    }

    function requestAdmin(address user, uint256 _formID) public view returns (bool) {
        return hasRole(getFormAdminRole(_formID), user);
    }

    function getFormAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_ADMIN_ROLE"));
    }

    function getFormContributorRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_CONTRIBUTOR_ROLE"));
    }

    function totalSupply() public view returns (uint256) {
        return formID.current();
    }

    function isDisputeAllowed(bytes32 assertionID, address disputer) public view returns (bool) {
        uint256 _formID = assertionInfo[assertionID].formID;
        if (
            hasRole(getFormAdminRole(_formID), disputer) ||
            hasRole(getFormContributorRole(_formID), disputer)
        ) {
            return true;
        }
        return false;
    }

    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return interfaceId == type(ERC165).interfaceId;
    }
}
