import { ClaimType } from "@sismo-core/sismo-connect-react";

export const sismoStandard: any = {
    claimType: ClaimType.GTE,
    groupId: undefined,
    groupTimestamp: "0x6c617465737400000000000000000000",
    value: 1,
    isOptional: false,
    isSelectableByUser: true,
    extraData: "0x"
  }
  
export interface Badge {
    id: string;
    description:string;
    name:string;
    latestSnapshot: latestSnapshot;
}
  

export interface latestSnapshot {
    dataUrl: string;
    id: string;
    size: String;
    timestamp: String;
    valueDistribution: [ValueDistribution];
}

export interface ValueDistribution {
    value: string;
    numberOfAccounts: number;
}