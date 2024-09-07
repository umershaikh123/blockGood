import React, { useCallback } from "react"
import { useClient } from "@xmtp/react-sdk"
import { Signer } from "ethers"
import { Button } from "@mui/material"
import Image from "next/image"
import xmtpLogo from "/public/Icons/xmtp.png"
interface CreateClientProps {
  signer: Signer
}

interface OptionType {
  persistConversations: boolean
  env: "dev" | "production" | "local"
}

export const CreateClient: React.FC<CreateClientProps> = ({ signer }) => {
  const { client, error, isLoading, initialize } = useClient()

  const handleConnect = useCallback(async () => {
    const options: OptionType = {
      persistConversations: false,
      env: "dev",
    }
    await initialize({ signer, options })
  }, [initialize, signer])

  if (error) {
    return (
      <p className=" text-[#5A2895]">
        An error occurred while initializing the client
      </p>
    )
  }

  if (isLoading) {
    return <p className=" text-[#5A2895]">Awaiting signatures...</p>
  }

  if (!client) {
    return (
      <Button
        variant="contained"
        onClick={handleConnect}
        startIcon={
          <Image
            src={xmtpLogo}
            width={30}
            height={30}
            alt="XMTP Logo"
            className=" rounded-2xl"
          />
        }
        sx={{
          backgroundColor: "#5A2895",
          color: "white",
          marginBottom: "1rem",
          border: "2px solid #5A2895",
          textTransform: "capitalize",
          px: "1rem",
          py: "4px",
          fontWeight: 600,
          borderRadius: "0.5rem",
          ":hover": {
            bgcolor: "white",
            color: "#5A2895",
            border: "2px solid #5A2895",
          },
        }}
      >
        Connect
      </Button>
    )
  }

  return (
    <Button
      variant="contained"
      onClick={handleConnect}
      startIcon={
        <Image
          src={xmtpLogo}
          width={30}
          height={30}
          alt="XMTP Logo"
          className=" rounded-2xl"
        />
      }
      sx={{
        backgroundColor: "#5A2895",
        color: "white",
        marginBottom: "1rem",
        border: "2px solid #5A2895",
        textTransform: "capitalize",
        px: "1rem",
        py: "4px",
        fontWeight: 600,
        borderRadius: "0.5rem",
        ":hover": {
          bgcolor: "white",
          color: "#5A2895",
          border: "2px solid #5A2895",
        },
      }}
    >
      Connected
    </Button>
  )
}
