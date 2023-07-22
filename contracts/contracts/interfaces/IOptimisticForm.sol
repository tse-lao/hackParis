//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IOptimisticForm {
    function isDisputeAllowed(bytes32 assertionID, address disputer) external view returns (bool);

    function startResolutionVoting(
        bytes32 assertionId,
        bytes32 identifier,
        uint256 time,
        bytes memory ancillaryData
    ) external;
}