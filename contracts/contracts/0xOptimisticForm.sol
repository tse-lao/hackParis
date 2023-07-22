// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {OptimisticOracleV3CallbackRecipientInterface} from "./interfaces/OptimisticOracleV3CallbackRecipientInterface.sol";
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

    struct OptimisticFormInfo {
        string formCID;
        uint256 mintPrice;
        uint256 formFunds;
        uint256 bondAmount;
        uint64 resolutionDays;
        address tokenTreasury;
        address bondCurrency;
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

    struct Dataset {
        uint256 formID;
        string datasetCID;
        uint256 mintPrice;
        address tokenTreasury;
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

    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private formID;

    // Mapping to store Data requests information for each formID
    mapping(uint256 => OptimisticFormInfo) private optimisticFormInfo;

    mapping(uint256 => ClaimRequest[]) public formRequiredClaims;

    mapping(uint256 => bytes32[]) public formAssertions;

    
        // Goerli
        // optimisticOracleV3 = OptimisticOracleV3Interface(
        //     0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB
        // );
        // Mumbai
        // optimisticOracleV3 = OptimisticOracleV3Interface(
        //     0x263351499f82C107e540B01F0Ca959843e22464a
        // );
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
        uint256 rows
    ) public exists(_formID) {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        // UMA assert valid contribution
        assertContributionTruth(_formID, Contribution(_formID, msg.sender, contributionCID, rows));
    }

    function assertContributionTruth(
        uint256 _formID,
        Contribution memory contribution
    ) internal {
        // TODO
    }

    function assertDatasetTreasury(
        uint256 _formID,
        address tokenTreasury
    ) public exists(_formID) {
        // fUNCTION TO ASSERT IF A DATASET IS BUILDED IN A FAIR WAY
        // TODO Contributors and Admins will be able to dispute
    }

    /// @dev Dispute
    function disputeAssertion(bytes32 assertionId) external {}

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
        return requestAccess(user, _formID);
    }

    function requestAccess(address user, uint256 _formID) public view returns (bool) {
        return
            hasRole(getRequestContributorRole(_formID), user) ||
            hasRole(getFormAdminRole(_formID), user) || balanceOf(user, _formID) > 0;
    }

    function requestAdmin(address user, uint256 _formID) public view returns (bool) {
        return hasRole(getFormAdminRole(_formID), user);
    }

    function getFormAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_ADMIN_ROLE"));
    }

    function getRequestContributorRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_CONTRIBUTOR_ROLE"));
    }

    function totalSupply() public view returns (uint256) {
        return formID.current();
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
