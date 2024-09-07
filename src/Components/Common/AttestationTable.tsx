import React, { useState } from "react"
import { donationTableDataType } from "../../constants/tableData"
import { ethers, BigNumber } from "ethers"
import Link from "next/link"
import { useAccount } from "wagmi"

import { getChainConfig } from "../../constants/chainConfig"

interface Attestation {
  id: string
  attester: string
  attestTimestamp: string
  data: {
    campaignId: number
    creatorAddress: `0x${string}` | undefined
    campaignTitle: string
    totalAmountRaised: number
    goalAmount: number
    startDate: number
    endDate: number
    numberOfDonors: number
    campaignPurpose: string
    beneficiary: `0x${string}` | undefined
    campaignType: boolean
    withdrawalAmount: number
    refundFee: number
  }
  transactionHash?: string
}

interface AttestationData {
  campaignId: number
  creatorAddress: `0x${string}` | undefined
  campaignTitle: string
  totalAmountRaised: number
  goalAmount: number
  startDate: number
  endDate: number
  numberOfDonors: number
  campaignPurpose: string
  beneficiary: `0x${string}` | undefined
  campaignType: boolean
  withdrawalAmount: number
  refundFee: number
}

interface AttestationTableProps {
  tableData: Attestation[]
  dataObject: AttestationData[]
  txHashes: string[]
}

export const CampaignAttestationTable: React.FC<AttestationTableProps> = ({
  tableData,
  dataObject,
  txHashes,
}) => {
  const { chain: networkChain } = useAccount()
  const chainConfig = getChainConfig(networkChain?.id || 11155111)
  const blockexplorer = chainConfig.blockExplorers.default.url
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(tableData.length / 5)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  console.log("tableData , dataObject , txHashes", {
    tableData,
    dataObject,
    txHashes,
  })

  const combinedData = tableData.map((item, index) => ({
    ...item,
    transactionHash: txHashes[index],
  }))

  const mergedData = combinedData.map(attestation => {
    const matchedData = dataObject.find(
      data =>
        data.creatorAddress?.toLowerCase() ===
        attestation.attester.toLowerCase()
    )

    const formattedAttestTimestamp = new Date(
      attestation.attestTimestamp
    ).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    if (matchedData) {
      return {
        ...attestation,
        transactionHash: attestation.transactionHash,
        attestTimestamp: formattedAttestTimestamp,
        data: {
          campaignId: matchedData.campaignId.toString(),
          campaignTitle: matchedData.campaignTitle,
          goalAmount: ethers.utils.formatEther(
            matchedData.goalAmount.toString()
          ),
          totalAmountRaised: ethers.utils.formatEther(
            matchedData.totalAmountRaised.toString()
          ),
          numberOfDonors: matchedData.numberOfDonors.toString(),
          withdrawalAmount: ethers.utils.formatEther(
            matchedData.withdrawalAmount.toString()
          ),
          refundFee: ethers.utils.formatEther(matchedData.refundFee.toString()),
          campaignPurpose: matchedData.campaignPurpose,
        },
      }
    }

    return {
      ...attestation,
      transactionHash: attestation.transactionHash,
      attestTimestamp: formattedAttestTimestamp,
      data: {},
    }
  })
  const displayedData = mergedData.slice((currentPage - 1) * 8, currentPage * 8)

  return (
    <div className="w-full mx-auto p-4 min-h-[47vh]">
      {/* Table */}
      <div className="overflow-x-auto shadow-sm">
        <table
          className="min-w-full border-2 border-[var(--secondary)]"
          style={{ borderSpacing: "0" }}
        >
          <thead>
            <tr className="bg-[var(--Bg)] text-[var(--primary)]">
              <th className="px-2 py-4 text-center">Campaign ID</th>
              <th className="px-6 w-fit py-4 text-left">Attester/Creator</th>
              <th className="px-6 py-4 text-center">Campaign Title</th>
              <th className="px-6 py-4 text-center">Goal Amount (ETH)</th>
              <th className="px-6 py-4 text-center">
                Total Amount Raised (ETH)
              </th>
              <th className="px-6 py-4 text-center">Number of Donors</th>
              <th className="px-6 py-4 text-center">Withdrawal Amount (ETH)</th>
              <th className="px-6 py-4 text-center">Refund Fee</th>
              <th className="px-6 py-4 text-center">Timestamp</th>
              <th className="px-6 py-4 text-center">Tx Hash</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--Bg)] text-[var(--secondary)] font-medium">
            {displayedData.map((attestation, index) => (
              <tr
                key={index}
                className="border-t border-[var(--primary)] font-bold"
              >
                <td className="px-2 py-4 text-center">
                  {attestation.data.campaignId || "N/A"}
                </td>
                <td
                  className="px-6 py-4 text-left text-ellipsis max-w-[3rem] overflow-clip"
                  title={attestation.attester}
                >
                  {attestation.attester || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.campaignTitle || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.goalAmount || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.totalAmountRaised || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.numberOfDonors || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.withdrawalAmount || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.refundFee || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.attestTimestamp || "N/A"}
                </td>
                <td
                  className="px-6 py-4 text-center text-ellipsis max-w-[3rem] overflow-clip"
                  title={attestation.transactionHash}
                >
                  <Link
                    href={`${blockexplorer}/tx/${attestation.transactionHash}`}
                    target="_blank"
                    className="hover:text-[var(--primary)] transition-all duration-300 ease-in-out"
                  >
                    {attestation.transactionHash || "N/A"}...
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-full text-[var(--primary)]"
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded-full ${
              currentPage === index + 1
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--primary)]"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-full text-[var(--primary)]"
        >
          {">"}
        </button>
      </div>
    </div>
  )
}
