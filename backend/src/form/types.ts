export interface ApprovalForAll {
    id: any;
    account: any;
    operator: any;
    approved: boolean;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface ContributionCreated {
    id: any;
    formID: BigInt;
    contributionCID: string;
    contributor: any;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface FormRequestCreated {
    id: any;
    formID: BigInt;
    name: string;
    category: string;
    formCID: string;
    submitionReward: BigInt;
    rewardToken: any;
    formAdmin: any;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface OwnershipTransferred {
    id: any;
    previousOwner: any;
    newOwner: any;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface RoleAdminChanged {
    id: any;
    role: any;
    previousAdminRole: any;
    newAdminRole: any;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface RoleGranted {
    id: any;
    role: any;
    account: any;
    sender: any;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface RoleRevoked {
    id: any;
    role: any;
    account: any;
    sender: any;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface TransferBatch {
    id: any;
    operator: any;
    from: any;
    to: any;
    ids: BigInt[];
    values: BigInt[];
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface TransferSingle {
    id: any;
    operator: any;
    from: any;
    to: any;
    Oxform_id: BigInt;
    value: BigInt;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }
  
  export interface URI {
    id: any;
    value: string;
    Oxform_id: BigInt;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: any;
  }

  