// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

library decodeAssertionID {
function extractAssertionId(bytes memory data) internal pure returns (bytes32) {
        bytes memory key = ":";
        uint256 startIdx = findKeyIndex(data, key);
        require(startIdx > 0, "Assertion ID not found in ancillary data");

        startIdx += key.length;
        uint256 endIdx = findEndIndex(data, startIdx);
        require(endIdx > startIdx, "Invalid ancillary data format");

        bytes memory assertionIdBytes = new bytes(32);
        for (uint256 i = startIdx; i < endIdx; i += 2) {
            uint256 value = uint8(data[i]);
            if (value >= 48 && value <= 57) {
                value -= 48;
            } else if (value >= 97 && value <= 102) {
                value -= 87;
            } else {
                revert("Invalid assertion ID format");
            }
            uint256 highNibble = value << 4;

            value = uint8(data[i + 1]);
            if (value >= 48 && value <= 57) {
                value -= 48;
            } else if (value >= 97 && value <= 102) {
                value -= 87;
            } else {
                revert("Invalid assertion ID format");
            }
            uint256 lowNibble = value;

            assertionIdBytes[(i - startIdx) / 2] = bytes1(uint8(highNibble | lowNibble));
        }

        bytes32 assertionId;
        assembly {
            assertionId := mload(add(assertionIdBytes, 32))
        }

        return assertionId;
    }

    function findKeyIndex(bytes memory data, bytes memory key) internal pure returns (uint256) {
        uint256 keyLen = key.length;
        uint256 dataLen = data.length;
        uint256 i = 0;
        while (i < dataLen) {
            bool found = true;
            for (uint256 j = 0; j < keyLen; j++) {
                if (data[i + j] != key[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
            i++;
        }
        return 0;
    }

    function findEndIndex(bytes memory data, uint256 startIdx) internal pure returns (uint256) {
        uint256 dataLen = data.length;
        uint256 i = startIdx;
        while (i < dataLen) {
            if (data[i] == 0x2c || data[i] == 0x7d) {
                // Found a comma (",") or closing curly brace ("}") indicating end of value
                return i;
            }
            i++;
        }
        return 0;
    }
}
