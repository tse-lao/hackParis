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
  formID: number;
  contributionCID: string;
  contributor: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface FormRequestCreated {
  id: any;
  formID: number;
  name: string;
  category: string;
  formCID: string;
  submitionReward: number;
  rewardToken: any;
  formAdmin: any;
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
  ids: number[];
  values: number[];
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface TransferSingle {
  id: any;
  operator: any;
  from: any;
  to: any;
  Oxform_id: number;
  value: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface URI {
  id: any;
  value: string;
  Oxform_id: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}
