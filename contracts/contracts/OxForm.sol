// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ISismoGlobalVerifier.sol";
import "./interfaces/ISismoStructs.sol";
import "./interfaces/ISender.sol";

contract OxForm is Ownable, ERC1155, AccessControl, ISismoStructs {

    ISismoGlobalVerifier sismoVerifier;
    ISender sender;
    using Counters for Counters.Counter;

    struct FormInfo {
        uint256 mintPrice;
        bool mintable;
        uint256 escrowAmount;
        uint256 submitionReward;
        address tokenTreasury;
        // optional
        IERC20 rewardToken;
        string formCID;
    }

    struct EventMetadata {
        string formCID;
        string name;
        string category;
        string claimsGroups;
    }

    event FormRequestCreated(
        uint256 formID,
        string name,
        string category,
        string formCID,
        uint256 submitionReward,
        uint256 mintPrice,
        IERC20 rewardToken,
        address formAdmin,
        string claimGroups
    );

    event ContributionCreated(uint256 formID, string contributionCID, address contributor);

    Counters.Counter private formID;

    mapping(uint256 => FormInfo) private formInfo;

    mapping(uint256 => mapping(address => bool)) private formContributors;

    mapping(address => uint256) private userContributions;

    mapping(uint256 => ClaimRequest[]) public formRequiredClaims;

    constructor(ISismoGlobalVerifier _sismoVerifier, ISender _sender) ERC1155("") {
        sismoVerifier = _sismoVerifier;
        sender = _sender;
    }

    function formRequest(
        uint256 mintPrice,
        uint256 submitionReward,
        bool mintable,
        EventMetadata memory eventMetadata,
        ClaimRequest[] memory _claims
    ) external payable {

        require(submitionReward <= msg.value, "provide more ETH");

        formID.increment();

        uint256 _formID = formID.current();
        // Native blockchain token request 
        formInfo[_formID] = FormInfo(mintPrice, mintable, msg.value, submitionReward, msg.sender, IERC20(address(0)), eventMetadata.formCID);

        for (uint i = 0; i < _claims.length; ) {
            formRequiredClaims[_formID].push(_claims[i]);
            unchecked {
                ++i;
            }
        }

         _grantRole(getFormAdminRole(_formID), msg.sender);

        emit FormRequestCreated(
            _formID,
            eventMetadata.name,
            eventMetadata.category,
            eventMetadata.formCID,
            submitionReward,
            mintPrice,
            IERC20(address(0)),
            msg.sender,
            eventMetadata.claimsGroups
        );
    }

    function formRequestERC20(
        uint256 mintPrice,
        uint256 submitionReward,
        uint256 valueTransferAmount,
        address tokenTreasury,
        bool mintable,
        IERC20 rewardToken,
        EventMetadata memory eventMetadata,
        ClaimRequest[] memory _claims
    ) external payable {
        require(address(rewardToken) != address(0), "cant set 0 address as ERC20");
        require(submitionReward <= valueTransferAmount, "provide more ETH");

        rewardToken.transferFrom(msg.sender, address(this), valueTransferAmount);

        formID.increment();

        uint256 _formID = formID.current();
        // Native blockchain token request 
        formInfo[_formID] = FormInfo(mintPrice, mintable, valueTransferAmount, submitionReward, tokenTreasury, rewardToken, eventMetadata.formCID);

        for (uint i = 0; i < _claims.length; ) {
            formRequiredClaims[_formID].push(_claims[i]);
            unchecked {
                ++i;
            }
        }
         
         _grantRole(getFormAdminRole(_formID), msg.sender);

        emit FormRequestCreated(
            _formID,
            eventMetadata.name,
            eventMetadata.category,
            eventMetadata.formCID,
            submitionReward,
            mintPrice,
            rewardToken,
            msg.sender,
            eventMetadata.claimsGroups
        );
    }

    function formContribution(
        uint256 _formID,
        bytes memory proofs,
        string calldata contributionCID
    ) public exists(_formID) {
        FormInfo storage form = formInfo[_formID];
        require(!formContributors[_formID][msg.sender], "you can only submit once");
        
        require(
            form.escrowAmount >= form.submitionReward,
            "no rewards to take"
        );

        // Verifying Claims
        if (formRequiredClaims[_formID].length > 0) {
            sismoVerifier.verifySismoProof(proofs, formRequiredClaims[_formID]);
        }

        formContributors[_formID][msg.sender] = true;
        uint reward = form.submitionReward;
        if (reward > 0) {
            // Supporting both native and ERC20 tokens us contribution rewards
            if (address(form.rewardToken) == address(0)) {
                address payable to = payable(msg.sender);
                to.transfer(reward);
            } else {
                form.rewardToken.approve(msg.sender, reward);
                require(form.rewardToken.transfer(msg.sender, reward));
            }
            // substract the contributionReward from the treasury amount
            form.escrowAmount -= reward;
        }


        emit ContributionCreated(_formID, contributionCID, msg.sender);

    }

    function mint(uint256 _formID) external payable exists(_formID) {
        require(formInfo[_formID].mintable);
        uint256 mintPrice = formInfo[_formID].mintPrice;
        require(mintPrice == msg.value, "wrong price");
        address payable to = payable(formInfo[_formID].tokenTreasury);
        // TODO GIVE SOME FEES TO A PAYMASTER SO THAT HE NEVER REMAINS WITHOUT FUNDS 
        if (isContract(formInfo[_formID].tokenTreasury)) {
            sender.sendViaCall{value: msg.value}(to);
        } else {
            to.transfer(msg.value);
        }
        _mint(msg.sender, _formID, 1, "");
    }

    function changeFormStatus(uint256 _formID, bool isMintable) external onlyRole(getFormAdminRole(_formID)){
        formInfo[_formID].mintable = isMintable;
    }

    function changeTreasuryAddress(uint256 _formID, address _newTokenTreasuryAddress)external onlyRole(getFormAdminRole(_formID)){
        FormInfo storage form = formInfo[_formID];
        form.tokenTreasury = _newTokenTreasuryAddress;
    }

    function getFormAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "FORM_ADMIN_ROLE"));
    }

    // For lighthouse custom access control
    function hasAccess(address user, uint256 _formID) public view returns (bool) {
        return balanceOf(user, _formID) > 0;
    }

    function totalSupply() public view returns (uint256) {
        return formID.current();
    }
    
    // function uri(uint256 _formID) public exists(_formID) view virtual override returns (string memory) {
    //     return formInfo[_formID].metadataURI;
    // }

    function getUserContributions(address user) public view returns (uint256) {
        return userContributions[user];
    }

    function getFormClaims(uint256 _formID) public view returns (ClaimRequest[] memory) {
        uint256 size = formRequiredClaims[_formID].length;
        ClaimRequest[] memory claims = new ClaimRequest[](size);
        for(uint256 i = 0; i < size;){
            claims[i] = formRequiredClaims[_formID][i];
        }
        return claims;
    }

    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    modifier exists(uint256 _formID) {
        require(_formID <= formID.current(), "non existed formID");
        _;
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
