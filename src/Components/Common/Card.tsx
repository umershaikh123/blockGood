import React from "react"
import { useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import ProgressBar from "./ProgressBar"
import { Button } from "@mui/material"
import { CampaignCardPropsType, CampaignType } from "../../types/campaign"
import { BigNumber } from "ethers"
export interface StatCardPropsType {
  raisedValue: BigNumber
  GoalValue: BigNumber
  LeftValue: BigNumber
}

// Helper function to format BigNumber to a string with commas
const formatBigNumber = (value: BigNumber): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 10,
  }).format(parseFloat(value.toString()) / 1e18) // Convert from Wei to ETH
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export const StatCard = ({
  raisedValue,
  GoalValue,
  LeftValue,
}: StatCardPropsType) => {
  const [ethToUsdRate, setEthToUsdRate] = React.useState<number | null>(null)

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        )
        const data = await response.json()
        setEthToUsdRate(data.ethereum.usd)
      } catch (error) {
        console.error("Failed to fetch ETH to USD rate:", error)
      }
    }

    fetchEthToUsdRate()
  }, [])

  const convertEthToUsd = (value: BigNumber) => {
    if (!ethToUsdRate) return { formatted: "Loading...", raw: 0 }
    const ethValueInDecimal = parseFloat(value.toString()) / 1e18 // Convert from Wei to ETH
    const usdValue = ethValueInDecimal * ethToUsdRate
    return { formatted: formatCurrency(usdValue), raw: usdValue }
  }

  const goalInUsd = convertEthToUsd(GoalValue)
  const raisedInUsd = convertEthToUsd(raisedValue)
  const leftInUsd = goalInUsd.raw - raisedInUsd.raw

  return (
    <div className=" bg-[var(--Bg)] w-full h-full  py-4 flex justify-evenly border-t-2 rounded-b-xl group-hover:border-[var(--primary)] transition-all duration-300  ">
      <div className="flex flex-col items-center justify-center  mx-6   h-fit ">
        <h1 className="  text-sm  font-semibold text-[var(--secondary)]">
          Raised
        </h1>
        <h1 className=" text-sm font-semibold text-[var(--primary)]">
          {raisedInUsd.formatted}
        </h1>
      </div>
      <div className="h-full  w-[1px] border border-gray-300  group-hover:border-[var(--primary)] transition-all duration-300 " />
      <div className="flex flex-col items-center justify-center  mx-6   h-fit    ">
        <h1 className="  text-sm  font-semibold text-[var(--secondary)]">
          Goal
        </h1>
        <h1 className=" text-sm font-semibold text-[var(--primary)]">
          {goalInUsd.formatted}
        </h1>
      </div>
      <div className="h-full  w-[1px] border border-gray-300 group-hover:border-[var(--primary)] transition-all duration-300" />
      <div className="flex flex-col items-center justify-center  mx-6   h-fit  ">
        <h1 className=" text-sm   font-semibold text-[var(--secondary)]">
          Left
        </h1>
        <h1 className="text-sm font-semibold text-[var(--primary)]">
          {formatCurrency(leftInUsd)}
        </h1>
      </div>
    </div>
  )
}

export const CampaignCard = ({
  bgImage,
  title,
  raisedValue,
  GoalValue,
  progress,
  handleClick,
  handleDrawer,
}: CampaignCardPropsType) => {
  // const leftValue = raisedValue - GoalValue

  console.log("statcard values", { raisedValue, GoalValue })

  return (
    <div
      className="group flex flex-col border-2 border-gray-200 w-fit rounded-xl h-full hover:border-[var(--primary)] transition-all duration-300 justify-between"
      onClick={handleDrawer}
    >
      <div className="">
        <img
          src={bgImage}
          width={350}
          height={350}
          alt="Campaign Background Image"
          className="rounded-xl "
        />
      </div>
      <h2 className="text-lg  font-semibold text-[var(--primary)] max-w-[21rem] p-2 opacity-90">
        {title}
      </h2>

      <div className=" mx-4">
        <ProgressBar progress={progress} />
      </div>
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
        onClick={event => {
          event.stopPropagation()
          handleClick()
        }}
      >
        Donate
      </Button>

      <div className="border">
        <StatCard
          raisedValue={raisedValue}
          GoalValue={GoalValue}
          LeftValue={BigNumber.from(0)}
        />
      </div>
    </div>
  )
}

export const CampaignCardContainer = ({
  campaignsList,
  handlePopUp,
  handleDrawer,
  progress,
}: {
  campaignsList: CampaignType[]
  handlePopUp: any
  handleDrawer: any
  progress: number
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4 gap-4   w-[90vw]">
        {campaignsList.map((campaign, index) => (
          <CampaignCard
            key={index}
            bgImage={campaign.coverImage}
            title={campaign.title}
            raisedValue={campaign.raised}
            GoalValue={campaign.goal}
            handleClick={handlePopUp}
            progress={progress}
            handleDrawer={() => handleDrawer(campaign)}
          />
        ))}
      </div>
    </>
  )
}
