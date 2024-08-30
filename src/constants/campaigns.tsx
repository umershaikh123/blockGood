import c1 from "/public/Images/campaign/c1.svg"
import c2 from "/public/Images/campaign/c2.svg"
import c3 from "/public/Images/campaign/c3.svg"
import { StaticImageData } from "next/image"
import { CampaignType } from "../types/campaign"

export const campaignsList: CampaignType[] = [
  {
    bgImage: c1,
    title: "Help raise funds for Cancer patients at California Hospital",
    raisedValue: "$10,000",
    GoalValue: "$15,000",
    LeftValue: "$5,000",
  },
  {
    bgImage: c2,
    title: "Support children's education in rural areas",
    raisedValue: "$5,000",
    GoalValue: "$12,000",
    LeftValue: "$7,000",
  },
  {
    bgImage: c3,
    title: "Provide meals for homeless shelters in New York",
    raisedValue: "$3,500",
    GoalValue: "$8,000",
    LeftValue: "$4,500",
  },
  {
    bgImage: c1,
    title: "Fund clean water projects in Sub-Saharan Africa",
    raisedValue: "$7,000",
    GoalValue: "$10,000",
    LeftValue: "$3,000",
  },
  {
    bgImage: c2,
    title: "Build a new library for underprivileged communities",
    raisedValue: "$2,200",
    GoalValue: "$5,000",
    LeftValue: "$2,800",
  },
]
