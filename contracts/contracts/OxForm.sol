// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OxForm is Ownable, ERC1155, AccessControl {
    
    using Counters for Counters.Counter;

    struct FormInfo {
        uint256 mintPrice;
        uint256 escrowAmount;
        uint256 submitionReward;
        address tokenTreasury;
        IERC20 rewardToken;
    }

    struct EventMetadata {
        string formCID;
        string name;
        string category;
        string formMetadataCID;
        address formAdmin;
    }

    event FormRequestCreated(
        uint256 formID,
        string name,
        string category,
        string formMetadataCID,
        uint256 submitionReward,
        IERC20 rewardToken,
        address formAdmin
    );

    event ContributionCreated(uint256 formID, string contributionCID, address contributor);

    Counters.Counter private formID;

    mapping(uint256 => FormInfo) private formInfo;

    mapping(uint256 => mapping(address => bool)) private formContributors;

    constructor() ERC1155("") {}

    function formRequest(
        uint256 mintPrice,
        uint256 submitionReward,
        address tokenTreasury,
        EventMetadata memory eventMetadata
    ) external payable {

        require(submitionReward <= msg.value, "provide more ETH");

        formID.increment();

        uint256 _formID = formID.current();
        // Native blockchain token request 
        formInfo[_formID] = FormInfo(mintPrice, msg.value, submitionReward, tokenTreasury, IERC20(address(0)));

         _grantRole(getFormAdminRole(_formID), eventMetadata.formAdmin);

        emit FormRequestCreated(
            _formID,
            eventMetadata.name,
            eventMetadata.category,
            eventMetadata.formMetadataCID,
            submitionReward,
            IERC20(address(0)),
            eventMetadata.formAdmin
        );
    }


    function formRequestERC20(
        uint256 mintPrice,
        uint256 submitionReward,
        uint256 valueTransferAmount,
        address tokenTreasury,
        IERC20 rewardToken,
        EventMetadata memory eventMetadata
    ) external payable {
        require(address(rewardToken) != address(0), "cant set 0 address as ERC20");
        require(submitionReward <= valueTransferAmount, "provide more ETH");

        rewardToken.transferFrom(msg.sender, address(this), valueTransferAmount);

        formID.increment();

        uint256 _formID = formID.current();
        // Native blockchain token request 
        formInfo[_formID] = FormInfo(mintPrice, valueTransferAmount, submitionReward, tokenTreasury, rewardToken);

         _grantRole(getFormAdminRole(_formID), eventMetadata.formAdmin);

        emit FormRequestCreated(
            _formID,
            eventMetadata.name,
            eventMetadata.category,
            eventMetadata.formMetadataCID,
            submitionReward,
            rewardToken,
            eventMetadata.formAdmin
        );
    }

    function formContribution(
        uint256 _formID,
        string calldata contributionCID
    ) public exists(_formID) {
        FormInfo storage form = formInfo[_formID];
        require(!formContributors[_formID][msg.sender], "you can only submit once");
        
        require(
            form.escrowAmount >= form.submitionReward,
            "no rewards to take"
        );

        formContributors[_formID][msg.sender] = true;
        uint reward = form.submitionReward;
        if (reward > 0) {
            address payable to = payable(msg.sender);
            to.transfer(reward);
        }
        if (reward > 0) {
            // Supporting both native and ERC20 tokens us contribution rewards
            if (address(form.rewardToken) != address(0)) {
                address payable to = payable(msg.sender);
                to.transfer(reward);
            } else {
                form.rewardToken.approve(msg.sender, reward);
                require(form.rewardToken.transfer(msg.sender, reward));
            }
        }
        // substract the contributionReward from the treasury amount
        form.escrowAmount -= reward;

        emit ContributionCreated(_formID, contributionCID, msg.sender);
    }

    function mint(uint256 _formID) external payable exists(_formID) {
        uint256 mintPrice = formInfo[_formID].mintPrice;
        require(mintPrice == msg.value, "wrong price");
        address payable to = payable(formInfo[_formID].tokenTreasury);
        to.transfer(msg.value);
        _mint(msg.sender, _formID, 1, "");
    }

    function getFormAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "FORM_ADMIN_ROLE"));
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
