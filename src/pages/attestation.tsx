import React, { useState, useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import type { NextPage } from "next"
import { useAccount, useWalletClient } from "wagmi"
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk"
import { parseEther, formatEther } from "viem"

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
    console.log("Starting queryAttestations")
    setLoading(true)
    try {
      const url = `https://testnet-rpc.sign.global/api/scan/attestations?schemaId=onchain_evm_11155111_0x6a&size=100`
      console.log("Fetching from URL:", url)
      const response = await fetch(url)
      const data = await response.json()
      console.log("Received data:", data)
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
        console.log("Formatted attestations:", formattedAttestations)
        setAttestations(formattedAttestations)
      } else {
        console.error("API request was not successful:", data.message)
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error querying attestations:", error)
      alert("Failed to query attestations. Check console for details.")
    } finally {
      setLoading(false)
      console.log("queryAttestations completed")
    }
  }

  useEffect(() => {
    queryAttestations()
  }, [])

  const createAttestation = async () => {
    console.log("createAttestation started")
    if (!address) {
      alert("Please connect your wallet first.")
      return
    }

    if (!campaignId || !amount) {
      alert("Please enter both campaign ID and amount.")
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
      alert(
        `Donation attestation created successfully! ID: ${attestationResult.attestationId}`
      )
      setCampaignId("")
      setAmount("")

      await queryAttestations()
    } catch (error) {
      console.error("Error creating attestation:", error)
      alert("Failed to create attestation. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-[var(--primary)] mb-6">
        Donation Tracker
      </h1>

      <div className="mt-4">
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
      </div>

      {attestations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Attestations</h2>
          <ul>
            {attestations.map(attestation => (
              <li key={attestation.id} className="mb-4 p-4 border rounded">
                <p>
                  <strong>ID:</strong> {attestation.id}
                </p>
                <p>
                  <strong>Attester:</strong> {attestation.attester}
                </p>
                <p>
                  <strong>Timestamp:</strong> {attestation.attestTimestamp}
                </p>
                {attestation.data.campaignId && (
                  <p>
                    <strong>Campaign ID:</strong> {attestation.data.campaignId}
                  </p>
                )}
                {attestation.data.donorAddress && (
                  <p>
                    <strong>Donor Address:</strong>{" "}
                    {attestation.data.donorAddress}
                  </p>
                )}
                {attestation.data.Amount && (
                  <p>
                    <strong>Amount:</strong>{" "}
                    {formatEther(BigInt(attestation.data.Amount))} ETH
                  </p>
                )}
                {attestation.data.timeStamp && (
                  <p>
                    <strong>Donation Time:</strong>{" "}
                    {new Date(attestation.data.timeStamp).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AttestationPage
