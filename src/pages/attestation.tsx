import React, { useState, useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import type { NextPage } from "next"
import { useAccount, useWalletClient } from "wagmi"
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk"
import { IndexService } from "@ethsign/sp-sdk"
import { parseEther, formatEther } from "viem"
import { toast } from "react-toastify"
import { AttestationTable } from "../Components/Common/Table"
import { ethers } from "ethers"
import { ThreeDots } from "react-loader-spinner"

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
}

const AttestationPage: NextPage = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [loading, setLoading] = useState(false)
  const [campaignId, setCampaignId] = useState("")
  const [amount, setAmount] = useState("")
  const [attestations, setAttestations] = useState<Attestation[]>([])

  const queryAttestations = async () => {
    setLoading(true)
    try {
      const indexService = new IndexService("testnet")
      // const res = await indexService.querySchemaList({
      //   id: "onchain_evm_11155111_0x6a",
      //   mode: "onchain",
      //   page: 1,
      //   size: 100,
      // })

      const res = await indexService.queryAttestationList({
        id: "",
        schemaId: "onchain_evm_11155111_0x6a",
        attester: "",
        page: 1,
        mode: "onchain",
        indexingValue: "",
      })

      console.log("res", res)
      // const abi = [
      //   "tuple(string campaignId, address donorAddress, uint256 Amount, string timeStamp)",
      // ]

      // // Encoded data (the one you want to decode)
      // const Data =
      //   "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000033232320000000000000000000000000000000000000000000000000000000000"

      // // Define the type array for decoding
      // const types = ["string", "address", "uint256", "string"]

      // // Decode the data
      // const decodedData = ethers.utils.defaultAbiCoder.decode(types, Data)

      // console.log("DECODED DATA ", {
      //   campaignId: decodedData.campaignId,
      //   donorAddress: decodedData.donorAddress,
      //   Amount: ethers.utils.formatEther(decodedData.Amount), // Convert Amount from wei to ETH
      //   timeStamp: decodedData.timeStamp,
      // })

      const url = `https://testnet-rpc.sign.global/api/scan/attestations?schemaId=onchain_evm_11155111_0x6a&size=100`
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        const formattedAttestations = data.data.rows.map((row: any) => {
          let parsedData = {}
          try {
            parsedData = JSON.parse(atob(row.data.slice(2)))
          } catch (error) {
            console.error("Error parsing attestation data:", error)
          }
          return {
            id: row.id,
            attester: row.attester,
            attestTimestamp: new Date(
              parseInt(row.attestTimestamp) * 1000
            ).toLocaleString(),
            data: parsedData,
          }
        })
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
    queryAttestations()
  }, [])

  const createAttestation = async () => {
    console.log("createAttestation started")
    if (!address) {
      toast.error("Please connect your wallet first.")
      return
    }

    if (!campaignId || !amount) {
      toast.error("Please enter both campaign ID and amount.")
      return
    }

    setLoading(true)
    try {
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.sepolia,
        walletClient: walletClient!,
      })

      const attestationResult = await client.createAttestation({
        schemaId: "0x6a",
        data: {
          campaignId: campaignId,
          donorAddress: address,
          Amount: parseEther(amount),
          timeStamp: new Date().toISOString(),
        },
        indexingValue: address.toLowerCase(),
      })

      console.log("Attestation created:", attestationResult)

      toast.success(
        `Donation attestation created successfully! ID: ${attestationResult.attestationId}`
      )
      setCampaignId("")
      setAmount("")

      await queryAttestations()
    } catch (error) {
      console.error("Error creating attestation:", error)

      toast.error("Failed to create attestation. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-[var(--primary)] mb-6">
        Donation Tracker
      </h1>

      {/* <div className="mt-4">
        <input
          type="text"
          placeholder="Campaign ID"
          value={campaignId}
          onChange={e => setCampaignId(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={createAttestation}
          disabled={loading || !address || !campaignId || !amount}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Creating Attestation..." : "Create Donation Attestation"}
        </button> 
      </div>*/}

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
          <AttestationTable tableData={attestations} />
        )}
      </div>
    </div>
  )
}

export default AttestationPage
