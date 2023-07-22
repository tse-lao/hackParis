// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./ISismoStructs.sol";

interface IConstants is ISismoStructs {
    struct OptimisticFormInfo {
        uint256 mintPrice;
        address tokenTreasury;
        FormDetails details;
        RequestStatus status;
        ClaimRequest[] requestRequiredClaims;
    }

    struct FormDetails {
        string category;
        uint256 requiredEntries;
        uint256 contributedEntries;
        uint256 minSubRows;
        uint64 resolutionDays;
        bytes32[] assertions;
    }

    struct Contribution {
        uint256 formID;
        address contributor;
        string contributionCID;
        uint256 rows;
    }

    struct Dataset {
        uint256 tokenID;
        string formCID;
        uint256 mintPrice;
        address tokenTreasury;
    }

    struct assertionDetails {
        uint256 formID;
        bool assertionType;
    }

    struct arbitrationResolutionVoting {
        uint256 formID;
        bool resolutionType; // True if it is for CreateDataset false if it is for a contribution
        uint256 votingEndTime;
        uint256 time;
        bytes ancillaryData;
        uint256 upvotes;
        uint256 downvotes;
    }

    // Enum to represent the state of a DB
    enum RequestStatus {
        OpenForContributions,
        ContributionsClosed,
        Mintable
    }
}
