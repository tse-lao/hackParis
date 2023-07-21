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

    Counters.Counter private formID;

    mapping(uint256 => FormInfo) private formInfo;

    constructor() ERC1155("") {
        
    }


    function FormRequest(
        uint256 mintPrice,
        uint256 submitionReward,
        address tokenTreasury,
        EventMetadata memory eventMetadata
    ) public payable {

        require(submitionReward <= msg.value, "you cannot sponsor any submission");

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

    function getRequestAdminRole(uint256 _formID) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_formID, "REQUEST_ADMIN_ROLE"));
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
