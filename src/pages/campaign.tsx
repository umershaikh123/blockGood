import React from "react"
import { Button } from "@mui/material"
import { Backdrop } from "@mui/material"
import {
  RegisterIndividualPopup,
  RegisterOrganizationPopup,
} from "../Components/Common/Popup"
import { ethers, BigNumber } from "ethers"

import Tippy from "@tippyjs/react"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"

const campaign = () => {
  const [individualPopUpOpen, setIndividualPopUpOpen] = React.useState(false)
  const handleIndividualClose = () => {
    setIndividualPopUpOpen(false)
  }
  const handleIndividualOpen = () => {
    setIndividualPopUpOpen(true)
  }

  const [organizationPopUpOpen, setOrganizationPopUpOpen] =
    React.useState(false)
  const handleOrganizationClose = () => {
    setOrganizationPopUpOpen(false)
  }
  const handleOrganizationOpen = () => {
    setOrganizationPopUpOpen(true)
  }

  return (
    <div className="flex flex-col mr-10">
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={individualPopUpOpen}
        onClick={handleIndividualClose}
      >
        <RegisterIndividualPopup handleClose={handleIndividualClose} />
      </Backdrop>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={organizationPopUpOpen}
        onClick={handleOrganizationClose}
      >
        <RegisterOrganizationPopup handleClose={handleOrganizationClose} />
      </Backdrop>

      <div className="flex  justify-between">
        <h1 className="text-3xl font-semibold ml-6 text-[var(--secondary)]">
          {" "}
          Your Campaign
        </h1>

        <div className=" space-x-6">
          <Tippy
            placement="bottom"
            animateFill={true}
            animation={"scale"}
            theme="custom2"
            content={`Register as Individual`}
          >
            <Button
              variant="outlined"
              sx={{
                color: "var(--primary)",
                bgcolor: "white",
                border: "2px solid var(--primary)",
                width: "full",
                px: "2rem",
                fontWeight: 600,
                borderRadius: "7px",
                ":hover": {
                  bgcolor: "var(--secondary)",
                  color: "white",
                  border: "2px solid var(--secondary)",
                },
              }}
              onClick={event => {
                handleIndividualOpen()
              }}
            >
              Individual
            </Button>
          </Tippy>

          <Tippy
            placement="bottom"
            animateFill={true}
            animation={"scale"}
            theme="custom2"
            content={`Register as Organization`}
          >
            <Button
              variant="outlined"
              sx={{
                color: "var(--Bg)",
                bgcolor: "var(--primary)",
                border: "2px solid var(--primary)",
                width: "full",
                px: "2rem",
                fontWeight: 600,
                borderRadius: "7px",
                ":hover": {
                  bgcolor: "var(--secondary)",
                  color: "white",
                  border: "2px solid var(--secondary)",
                },
              }}
              onClick={event => {
                handleOrganizationOpen()
              }}
            >
              Organization
            </Button>
          </Tippy>
        </div>
      </div>
    </div>
  )
}

export default campaign
