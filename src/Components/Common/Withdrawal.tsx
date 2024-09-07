import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { getChainConfig, getContractAddress } from "../../constants/chainConfig"
import { useAccount } from "wagmi"
import donationTrackerAbi from "../../contracts/abis/donationTracker.json"
import { ThreeDots } from "react-loader-spinner"
import { toast } from "react-toastify"
interface Withdrawal {
  amount: string
  admin: string
  reason: string
  timestamp: number
  proofUrl: string
  proofUploaded: boolean
}

interface WithdrawalsComponentProps {
  campaignId: string | undefined
}

const WithdrawalsComponent = ({ campaignId }: WithdrawalsComponentProps) => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { chain: networkChain, address } = useAccount()

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const chainConfig = getChainConfig(networkChain?.id || 11155111)
        const provider = new ethers.providers.JsonRpcProvider(
          chainConfig.rpcUrls.public.http[0]
        )
        const chainId = networkChain?.id || 11155111
        const contractAddress = getContractAddress(chainId)
        const donationContract = new ethers.Contract(
          contractAddress,
          donationTrackerAbi,
          provider
        )

        const withdrawalData = await donationContract.getAllWithdrawals(
          campaignId
        )

        const formattedData: Withdrawal[] = withdrawalData.map(
          (withdrawal: any) => ({
            amount: ethers.utils.formatEther(withdrawal.amount),
            admin: withdrawal.admin,
            reason: withdrawal.reason,
            timestamp: withdrawal.timestamp.toNumber(),
            proofUrl: withdrawal.proofUrl,
            proofUploaded: withdrawal.proofUploaded,
          })
        )

        setWithdrawals(formattedData)
      } catch (error: any) {
        toast.error(`Error: ${error}`)
        console.error("Error fetching withdrawals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWithdrawals()
  }, [campaignId])

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-[44rem] mx-auto">
      <h2 className="text-2xl font-semibold text-[var(--primary)] mb-4">
        Withdrawals
      </h2>
      {loading ? (
        <p className="text-center ">
          {" "}
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="var(--secondary)"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </p>
      ) : withdrawals.length > 0 ? (
        <div className="space-y-4">
          {withdrawals.map((withdrawal, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                Withdrawal #{index + 1}
              </h3>
              <p className="text-[var(--secondary)]">
                Amount: {withdrawal.amount} ETH
              </p>
              <p className="text-[var(--secondary)]">
                Admin: {withdrawal.admin}
              </p>
              <p className="text-[var(--secondary)]">
                Reason: {withdrawal.reason}
              </p>
              <p className="text-[var(--secondary)]">
                Timestamp:{" "}
                {new Date(withdrawal.timestamp * 1000).toLocaleString()}
              </p>
              {withdrawal.proofUploaded && (
                <a
                  href={withdrawal.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Proof
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No withdrawals found for this campaign.
        </p>
      )}
    </div>
  )
}

export default WithdrawalsComponent
