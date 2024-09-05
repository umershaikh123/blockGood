import React, { useState } from "react"
import { donationTableDataType } from "../../constants/tableData"
import { ethers } from "ethers"
import Link from "next/link"
import { useAccount } from "wagmi"
import getConfig from "next/config"
import { getChainConfig } from "../../constants/chainConfig"
const DonationHistoryTable = ({
  tableData,
}: {
  tableData: donationTableDataType[]
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(tableData.length / 5) // Calculate total pages based on data length

  const handlePageChange = (page: any) => {
    setCurrentPage(page)
  }

  const displayedData = tableData.slice((currentPage - 1) * 5, currentPage * 5) // Paginate the data

  return (
    <div className=" w-[80ch] mx-auto p-4 min-h-[47vh]">
      {/* Table */}
      <div className="overflow-x-auto   shadow-sm">
        <table
          className="min-w-full  border-2 border-[var(--secondary)] "
          style={{ borderSpacing: "0" }}
        >
          <thead>
            <tr className="bg-[var(--Bg)] text-[var(--primary)] ">
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-left">Donation</th>
              {/* <th className="px-6 py-4 text-left">Chain</th> */}
              {/* <th className="px-6 py-4 text-left">Tx Hash</th> */}
            </tr>
          </thead>
          <tbody className="bg-[var(--Bg)] text-[var(--secondary)]  font-medium">
            {displayedData.map((item, index) => (
              <tr
                key={index}
                className="border-t border-[var(--primary)] font-bold"
              >
                <td className="px-6 py-4">{item.address}</td>
                <td className="px-6 py-4">{item.donation} ETH</td>
                {/* <td className="px-6 py-4">{item.chain}</td>
                <td className="px-6 py-4">{item.txHash}</td> */}
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

export default DonationHistoryTable

interface Attestation {
  id: string
  attester: string
  attestTimestamp: string
  data: {
    campaignId?: string
    donorAddress?: string
    Amount?: string
    timeStamp?: string
  }
  transactionHash?: string
}

interface AttestationData {
  campaignId: string
  donorAddress: string
  Amount: bigint
  timeStamp: string
  transactionHash?: string
}

interface AttestationTableProps {
  tableData: Attestation[]
  dataObject: AttestationData[]
  txHashes: string[]
}

export const AttestationTable: React.FC<AttestationTableProps> = ({
  tableData,
  dataObject,
  txHashes,
}) => {
  const { chain: networkChain, address } = useAccount()
  const chainConfig = getChainConfig(networkChain?.id || 11155111)
  const blockexplorer = chainConfig.blockExplorers.default.url
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(tableData.length / 5)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  console.error(" tableData", tableData)
  console.log("dataObject Table", dataObject)
  const combinedData = tableData.map((item, index) => ({
    ...item,
    transactionHash: txHashes[index],
  }))

  const mergedData = combinedData.map(attestation => {
    const matchedData = dataObject.find(
      data =>
        data.donorAddress.toLowerCase() === attestation.attester.toLowerCase()
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

    const formattedDonationTime = matchedData
      ? new Date(matchedData.timeStamp).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A"

    return {
      ...attestation,
      transactionHash: attestation.transactionHash,
      attestTimestamp: formattedAttestTimestamp,
      data: {
        ...attestation.data,
        Amount: matchedData
          ? ethers.utils.formatEther(matchedData.Amount)
          : "N/A",
        timeStamp: formattedDonationTime,
        campaignId: matchedData
          ? matchedData.campaignId
          : attestation.data.campaignId || "N/A",
      },
    }
  })

  const displayedData = mergedData.slice((currentPage - 1) * 8, currentPage * 8)

  return (
    <div className=" w-full mx-auto p-4 min-h-[47vh]">
      {/* Table */}
      <div className="overflow-x-auto shadow-sm">
        <table
          className="min-w-full border-2 border-[var(--secondary)]"
          style={{ borderSpacing: "0" }}
        >
          <thead>
            <tr className="bg-[var(--Bg)] text-[var(--primary)]">
              <th className="px-6   w-fit py-4 text-left">Attester/Donor</th>
              <th className="px-6 py-4 text-center">Timestamp</th>
              <th className="px-2   py-4 text-center">Campaign ID</th>

              <th className="px-6 py-4 text-center">Amount (ETH)</th>
              <th className="px-6 py-4 text-center">Donation Time</th>
              <th className="px-6 py-4 text-center">Tx Hash</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--Bg)] text-[var(--secondary)] font-medium ">
            {displayedData.map((attestation, index) => (
              <tr
                key={index}
                className="border-t border-[var(--primary)] font-bold  "
              >
                <td className="px-2 py-4    ">{attestation.attester}</td>
                <td className="px-6 py-4 text-center">
                  {attestation.attestTimestamp}
                </td>
                <td className=" py-4  text-center ">
                  {attestation.data.campaignId || "N/A"}
                </td>

                <td className="  py-4  text-center">
                  {attestation.data.Amount}
                </td>
                <td className="px-6 py-4 text-center">
                  {attestation.data.timeStamp}
                </td>

                <td className="px-6 py-4 text-center text-ellipsis   ">
                  <Link
                    href={`${blockexplorer}/tx/${attestation.transactionHash}`}
                    target="_blank"
                    className="hover:text-[var(--primary)]  transition-all duration-300 ease-in-out"
                  >
                    {attestation.transactionHash.substring(0, 12)}...
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
