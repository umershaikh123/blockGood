import React from "react"
import Image, { StaticImageData } from "next/image"
import ProgressBar from "./ProgressBar"
import { Button } from "@mui/material"
import { CampaignCardPropsType, CampaignType } from "../../types/campaign"

export const CampaignCard = ({
  bgImage,
  title,
  raisedValue,
  GoalValue,
  LeftValue,
}: CampaignCardPropsType) => {
  return (
    <div className="group flex flex-col border-2 border-gray-200 w-fit rounded-xl h-full hover:border-[var(--primary)] transition-all duration-300">
      <Image
        src={bgImage}
        width={350}
        height={350}
        alt="Campaign Background Image"
        className="  object-contain rounded-xl"
      />
      <h2 className="text-lg  font-semibold text-[var(--primary)] max-w-[21rem] p-2 opacity-90">
        {title}
      </h2>
      <ProgressBar progress={50} />
      <Button
        variant="outlined"
        sx={{
          color: "var(--primary)",
          border: "2px solid var(--primary)",
          width: "full",
          marginX: "1rem",
          marginY: "1rem",
          fontWeight: 600,
          borderRadius: "6px",
          ":hover": {
            bgcolor: "var(--secondary)",
            color: "white",
            border: "2px solid var(--secondary)",
          },
        }}
      >
        Donate
      </Button>

      <div className=" bg-[var(--Bg)] w-full h-full flex justify-between border-t-2 rounded-b-xl group-hover:border-[var(--primary)] transition-all duration-300  ">
        <div className="flex flex-col items-center justify-center  mx-6  space-y-2  ">
          <h1 className="  text-sm  font-semibold text-[var(--secondary)]">
            Raised
          </h1>
          <h1 className=" text-sm font-semibold text-[var(--primary)]">
            {raisedValue}
          </h1>
        </div>
        <div className="h-[5rem]  w-[1px] border border-gray-300  group-hover:border-[var(--primary)] transition-all duration-300 " />
        <div className="flex flex-col items-center justify-center  mx-6  space-y-2  ">
          <h1 className="  text-sm  font-semibold text-[var(--secondary)]">
            Goal
          </h1>
          <h1 className=" text-sm font-semibold text-[var(--primary)]">
            {GoalValue}
          </h1>
        </div>
        <div className="h-[5rem]  w-[1px] border border-gray-300 group-hover:border-[var(--primary)] transition-all duration-300" />
        <div className="flex flex-col items-center justify-center  mx-6  space-y-2  ">
          <h1 className=" text-sm   font-semibold text-[var(--secondary)]">
            Left
          </h1>
          <h1 className="text-sm font-semibold text-[var(--primary)]">
            {LeftValue}
          </h1>
        </div>
      </div>
    </div>
  )
}

export const CampaignCardContainer = ({
  campaignsList,
}: {
  campaignsList: CampaignType[]
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4 gap-4   w-[90vw]">
        {campaignsList.map((campaign, index) => (
          <CampaignCard
            key={index}
            bgImage={campaign.bgImage}
            title={campaign.title}
            raisedValue={campaign.raisedValue}
            GoalValue={campaign.GoalValue}
            LeftValue={campaign.LeftValue}
          />
        ))}
      </div>
    </>
  )
}
