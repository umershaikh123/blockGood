import React, { useEffect } from "react"
import { useClient, Client } from "@xmtp/react-sdk"
import { Signer } from "ethers"
import { loadKeys, storeKeys } from "./keys"

interface CreateClientWithKeysProps {
  signer: Signer
}

interface OptionType {
  persistConversations?: boolean
  env: "dev" | "production" | "local"
}
export const CreateClientWithKeys: React.FC<CreateClientWithKeysProps> = ({
  signer,
}) => {
  const { initialize } = useClient()

  const initXmtpWithKeys = async () => {
    const options: OptionType = { env: "dev" }
    const address = await signer.getAddress()
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

  return <p>XMTP client initialized with stored keys.</p>
}
