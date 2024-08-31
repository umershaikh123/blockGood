import React, { useState } from "react"
import { donationTableDataType } from "../../constants/tableData"

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
              <th className="px-6 py-4 text-left">Chain</th>
              <th className="px-6 py-4 text-left">Tx Hash</th>
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
                <td className="px-6 py-4">{item.chain}</td>
                <td className="px-6 py-4">{item.txHash}</td>
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
