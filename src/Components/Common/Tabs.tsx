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
  handlePopUp: () => void
  handleDrawer: any
}

export default function TabsComponent({
  tabs,
  handlePopUp,
  handleDrawer,
}: TabsComponentProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0].value)

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-[28rem]">
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
            {activeTab === tabs[0].value && (
              <CampaignCardContainer
                campaignsList={campaignsList}
                handlePopUp={handlePopUp}
                handleDrawer={handleDrawer}
              />
            )}
          </div>
        </Fade>

        <Fade
          key={tabs[1].value}
          in={activeTab === tabs[1].value}
          timeout={600}
        >
          <div hidden={activeTab !== tabs[1].value}>
            {activeTab === tabs[1].value && <h1>Oragnaization Campaigns</h1>}
          </div>
        </Fade>

        <Fade
          key={tabs[2].value}
          in={activeTab === tabs[2].value}
          timeout={600}
        >
          <div hidden={activeTab !== tabs[2].value}>
            {activeTab === tabs[2].value && <h1>Individual Campaigns</h1>}
          </div>
        </Fade>
      </div>
    </div>
  )
}
