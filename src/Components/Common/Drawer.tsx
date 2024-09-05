import React, { useState, useEffect } from "react"

import Button from "@mui/material/Button"

import TabsComponent from "../../Components/Common/Tabs"
import { tabsProps } from "../../constants/tabs"
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge"
import ProgressBar from "../../Components/Common/ProgressBar"
import ForumIcon from "@mui/icons-material/Forum"
import { StatCard } from "../../Components/Common/Card"

import Box from "@mui/material/Box"

import { Close, Description } from "@mui/icons-material"

import Details from "../../Components/Common/Details"
import DonationHistoryTable from "../../Components/Common/Table"

import { ethers } from "ethers"

import { calculateCampaignProgress } from "../../util"
import { BigNumber } from "ethers"

import "react-toastify/dist/ReactToastify.css"

const drawerTabsProps = [
  {
    label: "Details",
    value: "details",
  },
  {
    label: "Donation History",
    value: "donation History",
  },
  {
    label: "Spending",
    value: "spending",
  },
]

interface DrawerContentProps {
  handleDrawerClose: any
  handleDonationOpen: (campaignID: string) => void
  title: string
  isIndividual: boolean
  raisedValue: BigNumber
  GoalValue: BigNumber
  LeftValue: BigNumber
  Description: string
  admin: boolean
  socialLink: string
  BgImage: string
  donationData: any
  campaignID: string
}

export function DrawerContent({
  handleDrawerClose,
  handleDonationOpen,
  title,
  isIndividual,
  raisedValue,
  GoalValue,
  LeftValue,
  Description,
  admin,
  socialLink,
  BgImage,
  donationData,
  campaignID,
}: DrawerContentProps) {
  const [tableData, setTableData] = useState(donationData)
  const donations = donationData?.DonationTracker_DonationReceived || []
  const formattedDonationData = donations
    .filter((donation: any) => donation.campaignId === campaignID)
    .map((donation: any) => ({
      address: donation.donor,
      donation: ethers.utils.formatEther(donation.amount),
    }))
  console.log("formattedDonationData", formattedDonationData)

  const progress = calculateCampaignProgress({
    raisedValue: raisedValue,
    goalValue: GoalValue,
  })

  return (
    <Box
      sx={{ width: "48rem", borderRadius: "5rem", padding: "1rem" }}
      role="presentation"
    >
      <div className="flex flex-col w-full text-[var(--primary)]">
        <div
          className="flex   justify-start items-center space-x-1"
          onClick={handleDrawerClose}
        >
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 30,
              ":hover": {
                transition: "transform 0.3s ease-in-out",

                transform: "rotate(90deg)",
              },
            }}
          />
          <h1 className="text-2xl font-semibold">Close</h1>
        </div>

        <div className="flex justify-center items-center my-4">
          <img
            src={BgImage}
            width={800}
            height={800}
            alt="Campaign Background"
            className=" rounded-xl"
          />
        </div>
        {/* <div className="flex justify-center items-center my-4">
            <ImageRowComponent />
          </div> */}

        <div className="flex justify-between    items-center my-4 w-full">
          <h1 className="text-3xl font-semibold max-w-[32vw]  w-11/12  ">
            {title}
          </h1>
          <Gauge
            width={80}
            height={80}
            value={progress}
            cornerRadius="50%"
            sx={theme => ({
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 15,
                fontWeight: 700,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: "var(--secondary)",
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: "var(--Bg)",
              },
            })}
          />
        </div>

        <ProgressBar progress={progress} />

        <div className={`justify-start items-center my-6 w-full space-x-4  `}>
          <div className={`${admin ? " hidden" : "flex"} space-x-4 `}>
            <Button
              variant="outlined"
              sx={{
                color: "var(--primary)",
                border: "2px solid var(--primary)",
                width: "full",
                px: "3rem",
                fontWeight: 600,
                borderRadius: "6px",
                ":hover": {
                  bgcolor: "var(--secondary)",
                  color: "white",
                  border: "2px solid var(--secondary)",
                },
              }}
              onClick={() => handleDonationOpen(campaignID)}
            >
              Donate
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <ForumIcon
                  sx={{
                    color: "white",
                  }}
                />
              }
              sx={{
                color: "white",
                border: "2px solid var(--primary)",
                bgcolor: "var(--primary)",
                width: "full",
                px: "3rem",
                fontWeight: 600,
                borderRadius: "6px",

                ":hover": {
                  bgcolor: "white",
                  color: "var(--secondary)",
                  border: "2px solid var(--secondary)",
                  "& .MuiSvgIcon-root": {
                    color: "var(--secondary)",
                  },
                },
              }}
              onClick={() => {
                console.log("chat button clicked")
              }}
            >
              Chat
            </Button>
          </div>
        </div>

        <div className="max-w-7/12  border-r border-l border-b  border-gray-300 rounded-xl  ">
          <StatCard
            raisedValue={raisedValue}
            GoalValue={GoalValue}
            LeftValue={LeftValue}
          />
        </div>

        <div className="mt-6 min-h-[40vh]">
          <TabsComponent
            tabs={drawerTabsProps}
            component1={
              <>
                <Details
                  description={Description}
                  xLink={socialLink}
                  InstaLink="/"
                  FaceBookLink="/"
                />
              </>
            }
            component2={
              <>
                {campaignID && formattedDonationData && (
                  <DonationHistoryTable tableData={formattedDonationData} />
                )}
              </>
            }
            component3={<div className="min-h-[30vh]"></div>}
            maxWidth="max-w-[32rem]"
          />
        </div>

        <div className="mb-[1rem]" />
      </div>
    </Box>
  )
}
