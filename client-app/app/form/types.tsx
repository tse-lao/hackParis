export type Form = {
    formID:number
    formCID:string
    category:string
    name:string
    rewardToken:string
    submitionReward:string
    formAdmin:string
    contributions: Contribution[] | []
    totalContributions: number
  }
export type Contribution = {
    dataCID: string
    contributor: string
}