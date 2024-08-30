import React, { useState, useEffect } from "react"
import type { NextPage } from "next"
import ColorTabs from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import SendIcon from "@mui/icons-material/Send"
const Home: NextPage = () => {
  return (
    <div className="flex flex-col relative ">
      <h1 className=" text-3xl text-[var(--secondary)] font-[600]">
        Campaigns
      </h1>
      <div className="mt-4">
        <ColorTabs tabs={tabsProps} />
      </div>

      <div className="absolute  right-20 top-10">
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
      </div>
    </div>
  )
}

export default Home
