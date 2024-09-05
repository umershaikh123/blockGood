import { StaticImageData } from "next/image"
import { BigNumber } from "ethers"
export interface CampaignCardPropsType {
  bgImage: string
  title: string
  raisedValue: BigNumber
  GoalValue: BigNumber
  active: boolean
  handleClick: any
  handleDrawer: any
}

export interface CampaignType {
  campaignId: string
  creator: string
  title: string
  description: string
  goal: BigNumber
  raised: BigNumber
  withdrawn: number
  coverImage: string
  active: boolean
  withdrawalCount: number
  admins: string[]
  creationFee: number
  lastWithdrawalProofUploaded: boolean
  destinationChainSelector: number
}
