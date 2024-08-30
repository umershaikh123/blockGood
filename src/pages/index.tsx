import React, { useState, useEffect } from "react"
import type { NextPage } from "next"
import ColorTabs from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import Tippy from "@tippyjs/react"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import DonationPopup from "../Components/Common/Popup"
import { Backdrop } from "@mui/material"

const Home: NextPage = () => {
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <div className="flex flex-col relative ">
      <h1 className=" text-3xl text-[var(--secondary)] font-[600]">
        Campaigns
      </h1>
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <DonationPopup handleClose={handleClose} />
      </Backdrop>

      <div className="mt-4">
        <ColorTabs tabs={tabsProps} handlePopUp={handleOpen} />
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
