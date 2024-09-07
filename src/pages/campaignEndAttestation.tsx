import React, { useState, useEffect } from "react"

import type { NextPage } from "next"

import { IndexService } from "@ethsign/sp-sdk"

import { toast } from "react-toastify"
import { AttestationTable } from "../Components/Common/Table"

import { ThreeDots } from "react-loader-spinner"
import { decodeAbiParameters } from "viem"
import Image from "next/image"
import signLogo from "/public/Icons/signIcon.webp"
import { CampaignAttestationTable } from "../Components/Common/AttestationTable"
interface Attestation {
  id: string
  attester: string
  attestTimestamp: string
  transactionHash?: string
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

const AttestationPage: NextPage = () => {
  const [loading, setLoading] = useState(false)

  const [attestations, setAttestations] = useState<Attestation[]>([])
  const [dataObject, setDataObject] = useState<AttestationData[]>([])
  const [transactionHashes, setTransactionHashes] = useState<string[]>([])

  const fetchAndDecodeAttestationData = async (attestations: any) => {
    const decodedObjects: AttestationData[] = []
    for (const att of attestations) {
      if (!att.data) continue

      const data = decodeAbiParameters(
        att.dataLocation === "onchain" ? att.schema.data : [{ type: "string" }],
        att.data
      )

      const obj: any = {}
      data.forEach((item: any, i: number) => {
        obj[att.schema.data[i].name] = item
      })
      decodedObjects.push(obj)
    }
    setDataObject(decodedObjects)
    console.log("decodedObjects", decodedObjects)
  }

  const queryAttestations = async () => {
    setLoading(true)
    try {
      const url = `https://testnet-rpc.sign.global/api/scan/attestations?schemaId=onchain_evm_11155111_0x83&size=100`
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        const formattedAttestations = data.data.rows.map((row: any) => {
          let parsedData = {}
          //   try {
          //     parsedData = JSON.parse(atob(row.data.slice(2)))
          //   } catch (error) {
          //     console.error("Error parsing attestation data:", error)
          //   }

          return {
            id: row.id,
            attester: row.attester,
            attestTimestamp: new Date(
              parseInt(row.attestTimestamp) * 1000
            ).toLocaleString(),
            data: parsedData,
          }
        })
        console.log("formattedAttestations", formattedAttestations)
        setAttestations(formattedAttestations)
      } else {
        console.error("API request was not successful:", data.message)
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error querying attestations:", error)
      toast.error("Failed to query attestations. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const indexService = new IndexService("testnet")

      const res = await indexService.queryAttestationList({
        id: "",
        schemaId: "onchain_evm_11155111_0x83",
        attester: "",
        page: 1,
        mode: "onchain",
        indexingValue: "",
      })

      if (res?.rows) {
        const hashes = res.rows.map(row => row.transactionHash)
        console.log("hashes ", hashes)

        setTransactionHashes(hashes)
      }

      await fetchAndDecodeAttestationData(res?.rows)
    }
    queryAttestations()
    fetchData()
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-center  ">
        <Image
          src={signLogo}
          width={140}
          height={140}
          alt="sign protocol logo"
          className=" "
        />
        <h1 className="text-3xl font-semibold text-[var(--primary)]  flex items-center   ">
          Campaign Tracker
        </h1>
      </div>

      <div>
        {loading ? (
          <div>
            {" "}
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="var(--secondary)"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <>
            <CampaignAttestationTable
              tableData={attestations}
              dataObject={dataObject}
              txHashes={transactionHashes}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AttestationPage
