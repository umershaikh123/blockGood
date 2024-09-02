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
  bgImage: StaticImageData
  title: string
  raisedValue: string
  GoalValue: string
  LeftValue: string
  Description: string
  socialLink: string
  progress: number
}
