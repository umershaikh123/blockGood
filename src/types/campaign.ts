import { StaticImageData } from "next/image"

export interface CampaignCardPropsType {
  bgImage: StaticImageData | string
  title: string
  raisedValue: string
  GoalValue: string
  LeftValue: string
  handleClick: any
  handleDrawer: any
}

export interface CampaignType {
  campaignID: string
  creator: string
  withdrawn: string
  active: boolean
  withdrawalCount: number
  creationFee: number
  lastWithdrawalProofUploaded: boolean
  destinationChainSelector: number
  bgImage: StaticImageData
  title: string
  raisedValue: string
  GoalValue: string
  LeftValue: string
  Description: string
  socialLink: string
  progress: number
}
