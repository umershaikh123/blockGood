import React, { useState, useEffect } from "react"
import type { NextPage } from "next"
import TabsComponent from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import Tippy from "@tippyjs/react"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import DonationPopup, { CampaignPopup } from "../Components/Common/Popup"
import { Backdrop } from "@mui/material"
import Image, { StaticImageData } from "next/image"
import c3 from "/public/Images/campaign/c3.svg"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import { Close, Description } from "@mui/icons-material"
// import StandardImageList from "../Components/Common/ImagesRow"
import ImageRowComponent from "../Components/Common/ImagesRow"
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge"
import ProgressBar from "../Components/Common/ProgressBar"
import ForumIcon from "@mui/icons-material/Forum"
import { StatCard } from "../Components/Common/Card"
import { campaignsList } from "../constants/campaigns"
import { CampaignCardContainer } from "../Components/Common/Card"
import Details from "../Components/Common/Details"
import DonationHistoryTable from "../Components/Common/Table"
import { donationTableData } from "../constants/tableData"
// import { donationTableData } from "../constants/tableData"
import { CampaignType } from "../types/campaign"
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
  handleDonationOpen: () => void
  title: string
  progress: number
  raisedValue: string
  GoalValue: string
  LeftValue: string
  Description: string
  donationTableData: any
  socialLink: string
  BgImage: StaticImageData
  campaignID: string
}

function DrawerContent({
  handleDrawerClose,
  handleDonationOpen,
  title,
  progress,
  raisedValue,
  GoalValue,
  LeftValue,
  Description,
  donationTableData,
  socialLink,
  BgImage,
  campaignID,
}: DrawerContentProps) {
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
          <Image
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

        <div className="flex justify-start items-center my-4 w-full">
          <h1 className="text-3xl font-semibold max-w-[32vw]">{title}</h1>
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

        <div className="flex justify-start items-center my-6 w-full space-x-4  ">
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
            onClick={event => {
              handleDonationOpen()
            }}
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
                {campaignID && (
                  <DonationHistoryTable
                    tableData={donationTableData[campaignID] || []}
                  />
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

const Home: NextPage = () => {
  const [donationPopUpOpen, setDonationPopUpOpen] = React.useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType | null>(
    null
  )

  const handleDonationClose = () => {
    setDonationPopUpOpen(false)
  }
  const handleDonationOpen = () => {
    setDonationPopUpOpen(true)
  }

  const [campaignPopUpOpen, setCampaignPopUpOpen] = React.useState(false)
  const handleCampaignClose = () => {
    setCampaignPopUpOpen(false)
  }
  const handleCampaignOpen = () => {
    setCampaignPopUpOpen(true)
  }

  const [openDrawer, setOpenDrawer] = React.useState(false)

  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpenDrawer(newOpen)
  // }

  const handleDrawerOpen = (campaign: CampaignType) => {
    setSelectedCampaign(campaign)
    setOpenDrawer(true)
  }

  const handleDrawerClose = () => {
    setOpenDrawer(false)
    setSelectedCampaign(null)
  }

  return (
    <div className="flex flex-col relative ">
      <h1 className=" text-3xl text-[var(--secondary)]   font-bold">
        Campaigns
      </h1>
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={donationPopUpOpen}
        onClick={handleDonationClose}
      >
        <DonationPopup handleClose={handleDonationClose} />
      </Backdrop>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={campaignPopUpOpen}
        onClick={handleCampaignClose}
      >
        <CampaignPopup handleClose={handleCampaignClose} />
      </Backdrop>

      <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        anchor="right"
        disableEnforceFocus
      >
        {selectedCampaign && (
          <DrawerContent
            handleDonationOpen={handleDonationOpen}
            handleDrawerClose={handleDrawerClose}
            raisedValue={selectedCampaign.raisedValue || "$0"}
            GoalValue={selectedCampaign.GoalValue || "$0"}
            LeftValue={selectedCampaign.LeftValue || "$0"}
            campaignID={selectedCampaign.campaignID || "0"}
            donationTableData={donationTableData}
            Description={selectedCampaign.Description || "null"}
            socialLink={selectedCampaign.socialLink || "/"}
            title={selectedCampaign.title || "null"}
            progress={selectedCampaign.progress || 50}
            BgImage={selectedCampaign.bgImage}
          />
        )}
      </Drawer>

      {/* <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        anchor="right"
        disableEnforceFocus
      >
        <DrawerContent
          handleDonationOpen={handleDonationOpen}
          handleDrawerClose={handleDrawerClose}
          raisedValue=""
          GoalValue=""
          LeftValue=""
          donationTableData={donationTableData}
          Description=""
          socialLink=""
          title=""
          progress={50}
          BgImage={c3}
        />
      </Drawer> */}

      <div className="mt-4">
        <TabsComponent
          tabs={tabsProps}
          component1={
            <CampaignCardContainer
              campaignsList={campaignsList}
              handlePopUp={handleDonationOpen}
              handleDrawer={handleDrawerOpen}
            />
          }
          component2={<>Content for Oragnizations campaigns</>}
          component3={<>Content for Individual campaigns</>}
        />
      </div>

      <div className="absolute  right-20 top-12 hidden min-[850px]:flex">
        <Tippy
          placement="top"
          animateFill={true}
          animation={"scale"}
          theme="custom"
          content={`Create new Campaign`}
        >
          <Button
            variant="contained"
            onClick={handleCampaignOpen}
            endIcon={
              <AddIcon
                sx={{
                  color: "var(--Bg)",
                }}
              />
            }
            sx={{
              backgroundColor: "var(--primary)",
              textTransform: "capitalize",

              borderRadius: "6px",
            }}
          >
            New Campaign
          </Button>
        </Tippy>
      </div>

      <div className="fixed bottom-8 right-5 flex min-[850px]:hidden">
        <Tippy
          placement="left"
          animateFill={true}
          animation={"scale"}
          theme="custom"
          content={`Create new Campaign`}
        >
          <button className=" rounded-full p-4 bg-[var(--primary)]">
            <AddIcon
              sx={{
                color: "white",
              }}
            />
          </button>
        </Tippy>
      </div>
    </div>
  )
}

export default Home
