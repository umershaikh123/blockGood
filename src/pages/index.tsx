import React, { useState, useEffect } from "react"
import type { NextPage } from "next"
import ColorTabs from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <h1 className=" text-3xl text-[var(--secondary)] font-[600]">
        Campaigns
      </h1>
      <div className="mt-4">
        <ColorTabs tabs={tabsProps} />;
      </div>
    </div>
  )
}

export default Home
