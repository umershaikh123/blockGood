import React from "react"
import { Chat } from "../Components/Xmtp/Chat"
import { useAccount } from "wagmi"
import { ethers, Signer } from "ethers"

const chat = () => {
  const { address, isConnected, chainId, isDisconnected } = useAccount()
  const [signer, setSigner] = React.useState<Signer>()

  React.useEffect(() => {
    if (isDisconnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      setSigner(signer)
    }
  }, [isDisconnected])

  return (
    <div>
      <h1 className="text-3xl font-semibold ml-6 text-[var(--primary)]">
        {" "}
        Chat
      </h1>

      {isConnected && signer ? (
        <Chat signer={signer} />
      ) : (
        <div className="h-[60vh] w-full flex justify-center items-center">
          <h1 className="text-3xl font-semibold ml-6 text-[var(--primary)] ">
            {" "}
            Please Connect Wallet
          </h1>
        </div>
      )}
    </div>
  )
}

export default chat
