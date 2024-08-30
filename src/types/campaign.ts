import { StaticImageData } from "next/image"

export interface CampaignCardPropsType {
  bgImage: StaticImageData | string
  title: string
  raisedValue: string
  GoalValue: string
  LeftValue: string
}

export interface CampaignType {
  bgImage: StaticImageData | string
  title: string
  raisedValue: string
  GoalValue: string
  LeftValue: string
}
