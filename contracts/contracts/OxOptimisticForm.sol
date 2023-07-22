// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {OptimisticOracleV3CallbackRecipientInterface} from "./interfaces/OptimisticOracleV3CallbackRecipientInterface.sol";
import {AncillaryData} from "@uma/core/contracts/common/implementation/AncillaryData.sol";
import {OptimisticOracleV3Interface} from "./interfaces/OptimisticOracleV3Interface.sol";
import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";
import "./interfaces/IEscalationManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ISismoGlobalVerifier.sol";
import "./interfaces/IConstants.sol";
import "./interfaces/ISender.sol";

contract OxOptimisticForm is Ownable, ERC1155, AccessControl, IConstants {
    /// @dev Will be used to resolve disputes on the delivery
    // Goerli
    OptimisticOracleV3Interface private optimisticOracleV3;
    IEscalationManager EscalationManager;
    ISismoGlobalVerifier SismoVerifier;
    ISender sender;
    bytes32 public constant Identifier = "YES_OR_NO_QUERY";

    event RequestCreated(
        uint256 formID,
        string requestName,
        string requestDescription,
        string category,
        string dataFormatCID,
        uint256 requiredEntries,
        uint256 minSubRows,
        address creator
    );

    event contributionAssertionCreated(uint256 formID, bytes32 assertionID);

    event ContributionCreated(
        bytes32 assertionId,
        uint256 formID,
        string contributionCID,
        uint256 rows,
        address contributor
    );

    event datasetAssertionCreated(uint256 formID, bytes32 assertionID);

    event DatasetCreated(
        uint256 tokenId,
        string formCID,
        uint256 mintPrice,
        address tokenTreasury
    );

    event assertionVote(
        bytes32 assertionID,
        address voter,
        bool vote
    );

    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private formID;

    // Mapping to store DatasetInfo for each token ID
    mapping(uint256 => OptimisticFormInfo) private optimisticFormInfo;

    mapping(address => uint256) private contributions;

    mapping(bytes32 => Contribution) private assertionToContribution;

    mapping(bytes32 => Dataset) private assertionToCreateDataset;

    mapping(bytes32 => arbitrationResolutionVoting) public assertionVotingPhase;

    mapping(bytes32 => assertionDetails) assertionInfo;

    mapping(bytes32 => mapping(address => bool)) resolutionVoters;

    constructor(ISismoGlobalVerifier _SismoVerifier, ISender _sender) ERC1155("") {
        sender = _sender;
        SismoVerifier = _SismoVerifier;
        // Goerli
        // optimisticOracleV3 = OptimisticOracleV3Interface(
        //     0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB
        // );
        // Mumbai
        optimisticOracleV3 = OptimisticOracleV3Interface(
            0x263351499f82C107e540B01F0Ca959843e22464a
        );
    }

    function setEscalationManager(IEscalationManager _EscalationManager) external onlyOwner {
        EscalationManager = _EscalationManager;
    }

    function getAssertions(uint256 _formID) public view returns (bytes32[] memory) {
        OptimisticFormInfo memory formInfo = optimisticFormInfo[_formID];
        bytes32[] memory assertions = new bytes32[](formInfo.details.assertions.length);
        for (uint i = 0; i < formInfo.details.assertions.length; i++) {
            assertions[i] = formInfo.details.assertions[i];
        }
        return assertions;
    }

    /**
     * @notice Creates a Dataset request
     * @dev Users can request the creation of a Dataset by providing data format, Dataset name, description, and other details.
     * @param dataFormatCID Format of data this Dataset will contain
     * @param requestName Dataset Name
     * @param requestDescription Dataset description
     * @param _details Data field categories
     * @param formAdmins Minimum amount of Rows to create the Dataset NFT
     */

    function optimisticFormRequest(
        string memory dataFormatCID,
        string memory requestName,
        string memory requestDescription,
        FormDetails memory _details,
        ClaimRequest[] memory _claims,
        address[] memory formAdmins
    ) public {
        require(_details.requiredEntries > 0);
        formID.increment();
        uint256 _formID = formID.current();
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        form.details = _details;
        form.status = RequestStatus.OpenForContributions;
        for (uint i = 0; i < _claims.length; ) {
            form.requestRequiredClaims.push(_claims[i]);
            unchecked {
                ++i;
            }
        }

        for (uint i = 0; i < formAdmins.length; ) {
            _grantRole(getRequestAdminRole(_formID), formAdmins[i]);
            unchecked {
                ++i;
            }
        }

        emit RequestCreated(
            _formID,
            requestName,
            requestDescription,
            _details.category,
            dataFormatCID,
            _details.requiredEntries,
            _details.minSubRows,
            msg.sender
        );
    }


    function getFormClaims(uint256 _formID) public view returns (ClaimRequest[] memory) {
        uint256 size = optimisticFormInfo[_formID].requestRequiredClaims.length;
        ClaimRequest[] memory claims = new ClaimRequest[](size);
        for(uint256 i = 0; i < size;){
            claims[i] = optimisticFormInfo[_formID].requestRequiredClaims[i];
        }
        return claims;
    }

    function assertContribution(
        uint256 _formID,
        string calldata contributionCID,
        uint256 rows,
        bytes calldata proofs
    ) public exists(_formID) {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        require(form.status == RequestStatus.OpenForContributions);
        require(form.details.minSubRows <= rows, "sumbit more data");
        // Verifying Claims
        if (form.requestRequiredClaims.length > 0) {
            SismoVerifier.verifySismoProof(proofs, form.requestRequiredClaims);
        }
        // UMA assert valid contribution
        assertContributionTruth(_formID, Contribution(_formID, msg.sender, contributionCID, 1));
    }

    function assertContributionTruth(
        uint256 _formID,
        Contribution memory contribution
    ) internal {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];

        bytes memory assertedClaim = abi.encodePacked(
            "Contribution on formID 0x",
            AncillaryData.toUtf8BytesUint(_formID),
            " with data : ",
            contribution.contributionCID,
            " with numebr of entries 0x",
            AncillaryData.toUtf8BytesUint(contribution.rows),
            " contributor address : 0x",
            AncillaryData.toUtf8BytesAddress(contribution.contributor)
        );

        IERC20 bondCurrency = optimisticOracleV3.defaultCurrency();
        uint256 bondAmount = optimisticOracleV3.getMinimumBond(address(bondCurrency));
        if (bondAmount > 0) {
            bondCurrency.approve(address(optimisticOracleV3), bondAmount);
        }
        
        bytes32 assertionID = optimisticOracleV3.assertTruth(
            assertedClaim,
            msg.sender,
            address(this), // callback recipient
            address(EscalationManager), // escalation manager
            form.details.resolutionDays,
            bondCurrency,
            bondAmount,
            Identifier,
            bytes32(block.chainid)
        );
        form.details.assertions.push(assertionID);

        assertionInfo[assertionID].formID = _formID;
        assertionInfo[assertionID].assertionType = false;
        assertionToContribution[assertionID] = contribution;
        emit contributionAssertionCreated(_formID, assertionID);

    }

    /*
     * @notice Creates a Dataset_NFT SoulBound token others can mint
     * it to gain access to the Dataset contents
     * @dev Create Dataset_NFT requires our
     * Backend to evaluate the formCID witch is a merge
     * of all the contributions and to create the tokenTreasury
     * using the thirdWeb factory to distribute fairly all the token mint
     * Revenues to the Contributors callable only from the NFT Requestor-Creator
     * @param formID: formID to of the Dataset that will be created
     * @param formCID: Merged CID of the DataBase
     * @param mintPrice: mint price of the Dataset
     * @param tokenTreasury: ThirdWeb splitter contractAddress
     * @param piece_cid: The Filecoin PayloadCID so it can get used to create
     * cross chain join queries on the tableland tables to get the Tableland versions
     * of the dealClient and the dealRewarder Deals Status
     */
    // Create UMA ASSERTION FOR THAT ALSO
    // Assertion to DatasetNFT
    function assertDataset(
        uint256 _formID,
        string memory formCID,
        uint256 mintPrice,
        address tokenTreasury
    ) public exists(_formID) onlyformAdmins(_formID) {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        require(form.status != RequestStatus.Mintable);

        bytes memory assertedClaim = abi.encodePacked(
            "Creation of TokenID 0x",
            AncillaryData.toUtf8BytesUint(_formID),
            " with data : ",
            formCID,
            " with mintPrice 0x",
            AncillaryData.toUtf8BytesUint(mintPrice),
            " splitter contract : 0x",
            AncillaryData.toUtf8BytesAddress(tokenTreasury)
        );

        IERC20 bondCurrency = optimisticOracleV3.defaultCurrency();
        uint256 bondAmount = optimisticOracleV3.getMinimumBond(address(bondCurrency));
        if (bondAmount > 0) {
            bondCurrency.approve(address(optimisticOracleV3), bondAmount);
        }
        bytes32 assertionID = optimisticOracleV3.assertTruth(
            assertedClaim,
            msg.sender,
            address(this), // callback recipient
            address(EscalationManager), // escalation manager
            form.details.resolutionDays,
            bondCurrency,
            bondAmount,
            Identifier,
            bytes32(block.chainid)
        );
        form.details.assertions.push(assertionID);

        // tableland assertion to contribution {num of rows or objects}
        assertionToCreateDataset[assertionID] = Dataset(_formID, formCID, mintPrice, tokenTreasury);

        assertionInfo[assertionID].formID = _formID;
        assertionInfo[assertionID].assertionType = true;
        emit datasetAssertionCreated(_formID, assertionID);
    }

    /// @dev Dispute
    function disputeAssertion(bytes32 assertionId) external {
        // No need while this is checked by the oracle and escalation manager
        // require(optimisticFormInfo[_formID].assertions.contains(assertionId), "Invalid");
        require(isDisputeAllowed(assertionId, msg.sender), "anothorized");
        IERC20 bondCurrency = optimisticOracleV3.defaultCurrency();
        uint256 bondAmount = optimisticOracleV3.getMinimumBond(address(bondCurrency));
        if (bondAmount > 0) {
            bondCurrency.approve(address(optimisticOracleV3), bondAmount);
        }
        optimisticOracleV3.disputeAssertion(assertionId, msg.sender);
    }

    // /// @dev UMA assertions callback
    function assertionResolvedCallback(
        bytes32 assertionId,
        bool assertedTruthfully
    ) external onlyOptimisticOracleV3 {
        Contribution storage contribution = assertionToContribution[assertionId];
        if (contribution.contributor != address(0)) {
            if (assertedTruthfully) {
                contributions[contribution.contributor]++;
                _grantRole(
                    getRequestContributorRole(assertionInfo[assertionId].formID),
                    contribution.contributor
                );
                emit ContributionCreated(
                    assertionId,
                    contribution.formID,
                    contribution.contributionCID,
                    contribution.rows,
                    contribution.contributor
                );
            }
        } else {
            if (assertedTruthfully) {
                Dataset storage Dataset = assertionToCreateDataset[assertionId];
                optimisticFormInfo[Dataset.tokenID].status = RequestStatus.Mintable;
                optimisticFormInfo[Dataset.tokenID].tokenTreasury = Dataset.tokenTreasury;
                optimisticFormInfo[Dataset.tokenID].mintPrice = Dataset.mintPrice;
                emit DatasetCreated(Dataset.tokenID, Dataset.formCID, Dataset.mintPrice, Dataset.tokenTreasury);
            }
        }
    }

    // /// @dev UMA dispute callback
    function assertionDisputedCallback(bytes32 assertionId) external view onlyOptimisticOracleV3 {
        // Start voting Proccess
    }

    function startResolutionVoting(
        bytes32 assertionId,
        bytes32 identifier,
        uint256 time,
        bytes memory ancillaryData
    ) external {
        arbitrationResolutionVoting storage assertionVoting = assertionVotingPhase[assertionId];
        uint256 _formID = assertionInfo[assertionId].formID;
        uint256 votingEndTime = (optimisticFormInfo[_formID].details.resolutionDays / 2) +
            block.timestamp;
        if (assertionInfo[assertionId].assertionType) {
            assertionVoting.formID = assertionInfo[assertionId].formID;
            assertionVoting.time = time;
            assertionVoting.votingEndTime = votingEndTime;
            assertionVoting.ancillaryData = ancillaryData;
            assertionVoting.resolutionType = true; // Dataset resolution
        } else {
            assertionVoting.formID = assertionInfo[assertionId].formID;
            assertionVoting.time = time;
            assertionVoting.votingEndTime = votingEndTime;
            assertionVoting.ancillaryData = ancillaryData;
        }
    }

    function voteOnAssertionResolution(
        bool vote,
        bytes32 assertionId
    )
        external
        // ) external onlyformAdmins(assertionInfo[assertionId].formID) {
        onlyRequestMembers(assertionInfo[assertionId].formID)
    {
        arbitrationResolutionVoting storage assertionVoting = assertionVotingPhase[assertionId];
        require(!resolutionVoters[assertionId][msg.sender]);
        require(assertionVoting.votingEndTime >= block.timestamp, "Voting ended");
        if (vote) assertionVoting.upvotes++;
        else assertionVoting.downvotes++;
        resolutionVoters[assertionId][msg.sender] = true;
        emit assertionVote(assertionId, msg.sender, vote);
    }

    function settleAssertions(uint256 _formID) external {
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        uint256 numberOfAssertions = form.details.assertions.length;
        bytes32 assertionId;
        for (uint i = 0; i < numberOfAssertions; ) {
            assertionId = form.details.assertions[i];
            OptimisticOracleV3Interface.Assertion memory assertion = optimisticOracleV3
                .getAssertion(assertionId);
            if (!assertion.settled) {
                bool disputed = assertion.disputer != address(0);
                if (disputed) {
                    arbitrationResolutionVoting memory assertionVoting = assertionVotingPhase[
                        assertionId
                    ];
                    bool resolved = assertionVoting.votingEndTime < block.timestamp ? true : false;
                    if (resolved) {
                        bool arbitrationResolution = assertionVoting.upvotes >
                            assertionVoting.downvotes
                            ? true
                            : false;
                        EscalationManager.setArbitrationResolution(
                            Identifier,
                            assertionVoting.time,
                            assertionVoting.ancillaryData,
                            arbitrationResolution
                        );
                        optimisticOracleV3.settleAssertion(assertionId);
                    }
                } else {
                    bool expired = assertion.expirationTime < block.timestamp ? true : false;
                    if (expired) {
                        optimisticOracleV3.settleAssertion(assertionId);
                    }
                }
            }
            unchecked {
                ++i;
            }
        }
    }

    function getAvailableAssertions(uint256 _formID) external view returns(bytes32[] memory){
        OptimisticFormInfo storage form = optimisticFormInfo[_formID];
        uint256 numberOfAssertions = form.details.assertions.length;
        bytes32[] memory availableAssertionsToSettle = new bytes32[](numberOfAssertions);
        bytes32 assertionId;
        for (uint i = 0; i < numberOfAssertions; ) {
            assertionId = form.details.assertions[i];
            OptimisticOracleV3Interface.Assertion memory assertion = optimisticOracleV3
                .getAssertion(assertionId);
            if (!assertion.settled) {
                bool disputed = assertion.disputer != address(0);
                if (disputed) {
                    arbitrationResolutionVoting memory assertionVoting = assertionVotingPhase[
                        assertionId
                    ];
                    bool resolved = assertionVoting.votingEndTime < block.timestamp ? true : false;
                    if (resolved) {
                        availableAssertionsToSettle[i] = assertionId;
                    }
                } else {
                    bool expired = assertion.expirationTime < block.timestamp ? true : false;
                    if (expired) {
                        availableAssertionsToSettle[i] = assertionId;
                    }
                }
            }
            unchecked {
                ++i;
            }
        }
        return availableAssertionsToSettle;
    }

    /*
     * @dev Minting Dataset NFTs only if it is mintable
     * @param formID: formID to mint
     */

    function mint(uint256 tokenID) external payable exists(tokenID) {
        require(optimisticFormInfo[tokenID].status == RequestStatus.Mintable, "Dataset not still mintable");
        require(optimisticFormInfo[tokenID].mintPrice == msg.value, "wrong price");
        address payable to = payable(optimisticFormInfo[tokenID].tokenTreasury);
        if (isContract(optimisticFormInfo[tokenID].tokenTreasury)) {
            sender.sendViaCall{value: msg.value}(to);
        } else {
            to.transfer(msg.value);
        }
        _mint(msg.sender, tokenID, 1, "");
    }

    /*
     * @dev Custom Access Control condition used with lighthouse for Dataset_NFTs
     * returns true if someone contributed or he is the cretor or he is a tokenHolder
     * @param sender: sender to check access
     * @param formID: formID to to check access for sender
     */

    function hasAccess(address user, uint256 _formID) public view returns (bool) {
        if (optimisticFormInfo[_formID].status == RequestStatus.Mintable) {
            return balanceOf(user, _formID) > 0;
        }
        return requestAccess(user, _formID);
    }

    function requestAccess(address user, uint256 _formID) public view returns (bool) {
        return
            hasRole(getRequestContributorRole(_formID), user) ||
            hasRole(getRequestAdminRole(_formID), user);
    }

    function requestAdmin(address user, uint256 _formID) public view returns (bool) {
        return hasRole(getRequestAdminRole(_formID), user);
    }

    function getRequestAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_ADMIN_ROLE"));
    }

    function getRequestContributorRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_CONTRIBUTOR_ROLE"));
    }

    /*
     * @notice returns the total number of Datasets
     */
    function totalSupply() public view returns (uint256) {
        return formID.current();
    }

    function isDisputeAllowed(bytes32 assertionID, address disputer) public view returns (bool) {
        uint256 _formID = assertionToContribution[assertionID].formID;
        if (
            hasRole(getRequestAdminRole(_formID), disputer) ||
            hasRole(getRequestContributorRole(_formID), disputer)
        ) {
            return true;
        }
        return false;
    }

    modifier exists(uint256 _formID) {
        require(_formID <= formID.current(), "non existed formID");
        _;
    }

    modifier onlyRequestMembers(uint256 _formID) {
        require(requestAccess(msg.sender, _formID), "anothorized request action");
        _;
    }

    modifier onlyformAdmins(uint256 _formID) {
        require(requestAdmin(msg.sender, _formID), "anothorized request action");
        _;
    }

    /**
     * @notice Reverts unless the configured Optimistic Oracle V3 is the caller.
     */
    modifier onlyOptimisticOracleV3() {
        require(msg.sender == address(optimisticOracleV3), "Not the Optimistic Oracle V3");
        _;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return
            // interfaceId == type(AccessControl).interfaceId ||
            interfaceId == type(ERC165).interfaceId;
    }

    function isContract(address addr) public view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
