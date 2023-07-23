export interface ApprovalForAll {
  id: any;
  account: any;
  operator: any;
  approved: boolean;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface ContributionCreated {
  id: any;
  assertionId: any;
  formID: number;
  contributionCID: string;
  rows: number;
  contributor: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface DatasetCreated {
  id: any;
  tokenId: number;
  formCID: string;
  mintPrice: number;
  tokenTreasury: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface OwnershipTransferred {
  id: any;
  previousOwner: any;
  newOwner: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface RequestCreated {
  id: any;
  formID: number;
  requestName: string;
  requestDescription: string;
  category: string;
  dataFormatCID: string;
  requiredEntries: number;
  minSubRows: number;
  creator: any;
  claimGroups: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface RoleAdminChanged {
  id: any;
  role: any;
  previousAdminRole: any;
  newAdminRole: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface RoleGranted {
  id: any;
  role: any;
  account: any;
  sender: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface RoleRevoked {
  id: any;
  role: any;
  account: any;
  sender: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface TransferBatch {
  id: any;
  operator: any;
  from: any;
  to: any;
  ids: [number];
  values: [number];
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface TransferSingle {
  id: any;
  operator: any;
  from: any;
  to: any;
  Contract_id: number;
  value: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface URI {
  id: any;
  value: string;
  Contract_id: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface assertionVote {
  id: any;
  assertionID: any;
  voter: any;
  vote: boolean;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface contributionAssertionCreated {
  id: any;
  formID: number;
  assertionID: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface datasetAssertionCreated {
  id: any;
  formID: number;
  assertionID: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}
