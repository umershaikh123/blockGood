import React, { useState, useEffect } from "react"
import type { NextPage } from "next"
import TabsComponent from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import Tippy from "@tippyjs/react"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import DonationPopup from "../Components/Common/Popup"
import { Backdrop } from "@mui/material"
import Image from "next/image"
import c3 from "/public/Images/campaign/c3.svg"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import { Close } from "@mui/icons-material"
// import StandardImageList from "../Components/Common/ImagesRow"
import ImageRowComponent from "../Components/Common/ImagesRow"
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge"
import ProgressBar from "../Components/Common/ProgressBar"
import ForumIcon from "@mui/icons-material/Forum"
import { StatCard } from "../Components/Common/Card"
import { campaignsList } from "../constants/campaigns"
import { CampaignCardContainer } from "../Components/Common/Card"
import Details from "../Components/Common/Details"
const Home: NextPage = () => {
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  const [openDrawer, setOpenDrawer] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen)
  }

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

  const DrawerList = (
    <Box
      sx={{ width: "40vw", borderRadius: "5rem", padding: "1rem" }}
      role="presentation"
    >
      <div className="flex flex-col w-full text-[var(--primary)]">
        <div
          className="flex   justify-start items-center space-x-1"
          onClick={toggleDrawer(false)}
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
            src={c3}
            width={800}
            height={800}
            alt="Campaign Background"
            className=" rounded-xl"
          />
        </div>
        <div className="flex justify-center items-center my-4">
          <ImageRowComponent />
        </div>

        <div className="flex justify-start items-center my-4 w-full">
          <h1 className="text-3xl font-semibold max-w-[32vw]">
            Help raise funds for Cancer patients at California Hospital{" "}
          </h1>
          <Gauge
            width={80}
            height={80}
            value={50}
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
                fill: "#FFDE99",
              },
            })}
          />
        </div>

        <ProgressBar progress={50} />

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
              handleOpen()
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
            raisedValue={"$25,000"}
            GoalValue={"$50,000"}
            LeftValue={"$25,000"}
          />
        </div>

        <div className="mt-6">
          <TabsComponent
            tabs={drawerTabsProps}
            component1={
              <>
                <Details
                  description="   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum"
                  xLink="/"
                  InstaLink="/"
                  FaceBookLink="/"
                />
              </>
            }
            component2={<>Content for Oragnizations campaigns</>}
            component3={<>Content for Individual campaigns</>}
            maxWidth="max-w-[32rem]"
          />
        </div>

        <div className="mb-[1rem]" />
      </div>
    </Box>
  )

  return (
    <div className="flex flex-col relative ">
      <h1 className=" text-3xl text-[var(--secondary)]   font-extrabold">
        Campaigns
      </h1>
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <DonationPopup handleClose={handleClose} />
      </Backdrop>

      <Drawer
        open={openDrawer}
        onClose={toggleDrawer(false)}
        anchor="right"
        disableEnforceFocus
      >
        {DrawerList}
      </Drawer>

      <div className="mt-4">
        <TabsComponent
          tabs={tabsProps}
          component1={
            <CampaignCardContainer
              campaignsList={campaignsList}
              handlePopUp={handleOpen}
              handleDrawer={toggleDrawer(true)}
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
