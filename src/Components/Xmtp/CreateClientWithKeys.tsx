import React, { useEffect } from "react"
import { useClient, Client } from "@xmtp/react-sdk"
import { Signer } from "ethers"
import { loadKeys, storeKeys } from "./keys"
import { Button } from "@mui/material"
import Image from "next/image"
import xmtpLogo from "/public/Icons/xmtp.png"
interface CreateClientWithKeysProps {
  signer: Signer
  address: `0x${string}`
}

interface OptionType {
  persistConversations?: boolean
  env: "dev" | "production" | "local"
}
export const CreateClientWithKeys: React.FC<CreateClientWithKeysProps> = ({
  signer,
  address,
}) => {
  const { initialize, client, error, isLoading } = useClient()

  const initXmtpWithKeys = async () => {
    const options: OptionType = { env: "dev" }
    // const address = await signer.getAddress()
    let keys = loadKeys(address)
    if (!keys) {
      keys = await Client.getKeys(signer, {
        ...options,
        skipContactPublishing: true,
        persistConversations: false,
      })
      storeKeys(address, keys)
    }
    await initialize({ keys, options, signer })
  }

  useEffect(() => {
    void initXmtpWithKeys()
  }, [])

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
        onClick={initXmtpWithKeys}
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
