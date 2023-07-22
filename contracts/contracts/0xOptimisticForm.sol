// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {OptimisticOracleV3CallbackRecipientInterface} from "./interfaces/OptimisticOracleV3CallbackRecipientInterface.sol";
import {OptimisticOracleV3Interface} from "./interfaces/OptimisticOracleV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ISismoGlobalVerifier.sol";
import "./interfaces/ISismoStructs.sol";
import "./interfaces/IEscalationManager.sol";
import "./interfaces/ISender.sol";

contract OxOptimisticForm is Ownable, ERC1155, ISismoStructs {
    /// @dev Will be used to resolve disputes on the delivery
    // Goerli
    OptimisticOracleV3Interface private optimisticOracleV3;

    ISismoGlobalVerifier sismoVerifier;

    // TODO CUSTOM DIPUTE RESOLUTION MECHANISM
    IEscalationManager EscalationManager;
    ISender sender;

    struct OptimisticFormInfo {
        uint256 mintPrice;
        uint256 formFunds;
        uint64 resolutionDays;
        address tokenTreasury;
        address tokenGateAddress;
        TokenGateType tokenGateType;
        bytes32[] assertions;
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
        ERC20,
        ERC721,
        ERC1155
    }

    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private formID;

    // Mapping to store Data requests information for each formID
    mapping(uint256 => OptimisticFormInfo) private optimisticFormInfo;

    mapping(uint256 => ClaimRequest[]) public formRequiredClaims;

    
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
        string memory formCID,
        string memory requestName,
        string memory requestDescription,
        string memory category,
        uint256 mintPrice,
        address[] memory requestAdmins,
        ClaimRequest[] memory _claims
    ) public {
        formID.increment();
        uint256 _formID = formID.current();
        // TODO the request dataset workflow
        for (uint i = 0; i < _claims.length; ) {
            formRequiredClaims[_formID].push(_claims[i]);
            unchecked {
                ++i;
            }
        }
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
}
