// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OxForm is Ownable, ERC1155, AccessControl {
    using Counters for Counters.Counter;

    struct FormInfo {
        uint256 mintPrice;
        uint256 escrowAmount;
        uint256 submitionReward;
        address tokenTreasury;
    }

    struct EventMetadata {
        string  formCID;
        string  name;
        string  category;
        string  formMetadataCID;
        address[] requestAdmins;
    }

    event FormRequestCreated(
        uint256 formID,
        string name,
        string category,
        string formMetadataCID,
        uint256 submitionReward,
        address[] requestAdmins
    );

    event ContributionCreated(uint256 formID, string contributionCID, address contributor);

    Counters.Counter private formID;

    mapping(uint256 => FormInfo) private formInfo;

    mapping(uint256 => mapping(address => bool)) private formContributors;

    constructor() ERC1155("") {

    }

    function formRequest(
        uint256 mintPrice,
        uint256 submitionReward,
        address tokenTreasury,
        EventMetadata memory eventMetadata
    ) external payable {

        require(submitionReward <= msg.value, "provide more ETH");

        formID.increment();

        uint256 _formID = formID.current();

        formInfo[_formID] = FormInfo(mintPrice, msg.value, submitionReward, tokenTreasury);

        for (uint i = 0; i < eventMetadata.requestAdmins.length; ) {
            _grantRole(getRequestAdminRole(_formID), eventMetadata.requestAdmins[i]);
            unchecked {
                ++i;
            }
        }

        emit FormRequestCreated(
            _formID,
            eventMetadata.name,
            eventMetadata.category,
            eventMetadata.formMetadataCID,
            submitionReward,
            eventMetadata.requestAdmins
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
        // substract the contributionReward from the treasury amount
        form.escrowAmount -= reward;

        emit ContributionCreated(_formID, contributionCID, msg.sender);
    }

    function getRequestAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_ADMIN_ROLE"));
    }

    function hasAccess(address user, uint256 _formID) public view returns (bool) {
        return balanceOf(user, _formID) > 0;
    }

    function totalSupply() public view returns (uint256) {
        return formID.current();
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
