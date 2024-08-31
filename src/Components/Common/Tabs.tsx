"use client"
import * as React from "react"
import { CampaignCardContainer } from "../../Components/Common/Card"
import { campaignsList } from "../../constants/campaigns"
import { Fade, Zoom, Slide } from "@mui/material"

interface Tab {
  label: string
  value: string
}

interface TabsComponentProps {
  tabs: Tab[]
  maxWidth?: string
  component1: any
  component2: any
  component3: any
}

export default function TabsComponent({
  tabs,
  maxWidth = "max-w-[28rem]",
  component1,
  component2,
  component3,
}: TabsComponentProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0].value)

  return (
    <div
      className={`flex flex-col items-center justify-between w-full ${maxWidth}`}
    >
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-8 py-1 mx-2 rounded-full text-base font-semibold transition-all duration-300 
          ${
            activeTab === tab.value
              ? "bg-white border-[2px] border-[var(--secondary)] text-[var(--secondary)]"
              : "bg-transparent border-[2px] border-gray-300 text-[var(--secondary)]"
          }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full p-4 mt-4">
        <Fade
          key={tabs[0].value}
          in={activeTab === tabs[0].value}
          timeout={600}
        >
          <div hidden={activeTab !== tabs[0].value}>
            {activeTab === tabs[0].value && <>{component1}</>}
          </div>
        </Fade>

        <Fade
          key={tabs[1].value}
          in={activeTab === tabs[1].value}
          timeout={600}
        >
          <div hidden={activeTab !== tabs[1].value}>
            {activeTab === tabs[1].value && <>{component2}</>}
          </div>
        </Fade>

        <Fade
          key={tabs[2].value}
          in={activeTab === tabs[2].value}
          timeout={600}
        >
          <div hidden={activeTab !== tabs[2].value}>
            {activeTab === tabs[2].value && <>{component3}</>}
          </div>
        </Fade>
      </div>
    </div>
  )
}
