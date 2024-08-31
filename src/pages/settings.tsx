import React from "react"
import ThemeSwitcher from "../Components/Common/ThemeSwitcher"

const Settings = () => {
  return (
    <div className="ml-6">
      <h1 className="text-3xl font-semibold  text-[var(--primary)]">
        {" "}
        Settings
      </h1>

      <div className="mt-4">
        <ThemeSwitcher />
      </div>
    </div>
  )
}

export default Settings
