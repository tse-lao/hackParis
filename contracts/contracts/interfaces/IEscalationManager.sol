// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

/**
 * @title Escalation Manager Interface
 * @notice Interface for contracts that manage the escalation policy for assertions.
 */
interface IEscalationManager {
    function setArbitrationResolution(
        bytes32 identifier,
        uint256 time,
        bytes memory ancillaryData,
        bool arbitrationResolution
    ) external;
}
