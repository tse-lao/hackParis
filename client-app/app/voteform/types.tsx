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
export type Contribution = {
    dataCID: string
    contributor: string
}