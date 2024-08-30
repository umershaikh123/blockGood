"use client"
import * as React from "react"

interface Tab {
  label: string
  value: string
  component: React.ReactNode
}

interface ColorTabsProps {
  tabs: Tab[]
}

export default function ColorTabs({ tabs }: ColorTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0].value)

  return (
    <div className="flex flex-col items-center justify-between    w-full max-w-[28rem]">
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
        {tabs.map(tab => (
          <div
            key={tab.value}
            className={`transition-opacity transform duration-500 ${
              activeTab === tab.value
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5"
            }`}
          >
            {activeTab === tab.value && tab.component}
          </div>
        ))}
      </div>
    </div>
  )
}
