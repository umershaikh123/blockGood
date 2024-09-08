import React, { useState, useEffect } from "react"
import type { NextPage } from "next"
import TabsComponent from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import Tippy from "@tippyjs/react"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import DonationPopup, { CampaignPopup } from "../Components/Common/Popup"
import { Backdrop } from "@mui/material"

import Drawer from "@mui/material/Drawer"

import { CampaignCardContainer } from "../Components/Common/Card"

import { useQuery } from "@apollo/client"
import { GET_CAMPAIGN_IDS, GET_DONATION_RECIEVED } from "../util/Queries"

import {
  chainConfigs,
  getChainConfig,
  getContractAddress,
} from "../constants/chainConfig"
import donationTrackerAbi from "../contracts/abis/donationTracker.json"
import { ethers } from "ethers"
import { useAccount, useWalletClient } from "wagmi"
import { calculateCampaignProgress } from "../util"
import { BigNumber } from "ethers"
import { ThreeDots } from "react-loader-spinner"
import { toast, ToastContainer } from "react-toastify"
import { ToastIcon } from "react-toastify/dist/types"
import "react-toastify/dist/ReactToastify.css"
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk"
import { DrawerContent } from "../Components/Common/Drawer"

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

const Home: NextPage = () => {
  type Campaign = {
    campaignId: string
    creator: string
    title: string
    description: string
    goal: BigNumber
    raised: BigNumber
    withdrawn: number
    coverImage: string
    active: boolean
    withdrawalCount: number
    admins: string[]
    creationFee: number
    lastWithdrawalProofUploaded: boolean
    destinationChainSelector: number
  }

  const { data: walletClient } = useWalletClient()

  const [donationPopUpOpen, setDonationPopUpOpen] = React.useState(false)

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  )
  const [campaignPopUpOpen, setCampaignPopUpOpen] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { chain: networkChain, address, isConnected } = useAccount()

  const { error, data, refetch } = useQuery(GET_CAMPAIGN_IDS)
  const { data: donationData } = useQuery(GET_DONATION_RECIEVED)

  const [campaignsList, setCampaignsList] = useState<Campaign[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isIndividual, setIsIndividual] = useState<boolean>(false)
  const [currentCampaignID, setCurrentCampaignID] = React.useState("")

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setLoading(true)
      try {
        const chainConfig = getChainConfig(networkChain?.id || 11155111)
        const provider = new ethers.providers.JsonRpcProvider(
          chainConfig.rpcUrls.public.http[0]
        )
        const contractAddress = chainConfig.contractAddress
        const donationContract = new ethers.Contract(
          contractAddress,
          donationTrackerAbi,
          provider
        )

        const fetchedCampaigns: Campaign[] = []

        for (const campaign of data.DonationTracker_CampaignCreated) {
          const { campaignId } = campaign

          const campaignDetails: Campaign =
            await donationContract.getCampaignDetails(campaignId)
          console.log("campaignDetails", campaignDetails)
          fetchedCampaigns.push({
            campaignId,
            creator: campaignDetails.creator,
            title: campaignDetails.title,
            description: campaignDetails.description,
            goal: BigNumber.from(campaignDetails.goal),
            raised: BigNumber.from(campaignDetails.raised),
            withdrawn: campaignDetails.withdrawn,
            coverImage: campaignDetails.coverImage,
            active: campaignDetails.active,
            withdrawalCount: campaignDetails.withdrawalCount,
            admins: campaignDetails.admins,
            creationFee: campaignDetails.creationFee,
            lastWithdrawalProofUploaded:
              campaignDetails.lastWithdrawalProofUploaded,
            destinationChainSelector: campaignDetails.destinationChainSelector,
          })
        }
        console.log("fetchedCampaigns", fetchedCampaigns)
        setCampaignsList(fetchedCampaigns)
      } catch (error) {
        console.error("Error fetching campaign details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (data) {
      console.log("data", data)

      fetchCampaignDetails()
    }
  }, [data, networkChain])

  if (error) return <p>Error : {error.message}</p>

  const handleDonationClose = () => {
    setDonationPopUpOpen(false)
  }
  const handleDonationOpen = (CampaignID: string) => {
    setCurrentCampaignID(CampaignID)
    setDonationPopUpOpen(true)
  }

  const handleCampaignClose = () => {
    setCampaignPopUpOpen(false)
  }
  const handleCampaignOpen = () => {
    setCampaignPopUpOpen(true)
  }

  const fetchIsIndividual = async (creatorAddress: string) => {
    if (creatorAddress) {
      const chainConfig = getChainConfig(networkChain?.id || 11155111)
      const provider = new ethers.providers.JsonRpcProvider(
        chainConfig.rpcUrls.public.http[0]
      )
      const contractAddress = chainConfig.contractAddress
      const donationContract = new ethers.Contract(
        contractAddress,
        donationTrackerAbi,
        provider
      )

      const isIndividual = await donationContract.isRegisteredAsIndividual(
        creatorAddress
      )

      if (isIndividual) {
        setIsIndividual(true)
      } else {
        setIsIndividual(false)
      }
    }
  }

  const handleDrawerOpen = (campaign: Campaign) => {
    fetchIsIndividual(campaign.creator)
    setSelectedCampaign(campaign)
    setOpenDrawer(true)
  }

  const handleDrawerClose = () => {
    setOpenDrawer(false)
    setSelectedCampaign(null)
  }

  const handleDonate = async (amount: number) => {
    console.log("campaign ID", currentCampaignID)
    console.log("donation amount", amount)
    if (!isConnected) {
      toast.error("Please Connect wallet")
      return
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid donation amount.")
      return
    }
    const pendingToastId = toast.loading("Transaction Pending...")
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const contractAddress =
        chainConfigs[networkChain?.id || 11155111].contractAddress
      const donationContract = new ethers.Contract(
        contractAddress,
        donationTrackerAbi,
        provider
      )

      const ContractSigner = donationContract.connect(signer)
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.sepolia,
        walletClient: walletClient!,
      })

      toast.info("Sending Donation ...")
      const tx = await ContractSigner.donate(currentCampaignID, {
        value: ethers.utils.parseEther(amount.toString()),
      })

      const receipt = await tx.wait()
      toast.update(pendingToastId, {
        render: "Donation Successful!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      })

      toast.info(
        <div>
          View{" "}
          <a
            href={`${
              chainConfigs[networkChain?.id || 11155111].blockExplorers.default
                .url
            }/tx/${receipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--secondary)", textDecoration: "underline" }}
          >
            Tx
          </a>
        </div>,
        {
          autoClose: 5000,
        }
      )

      toast.info("Creating Attestation ...")
      const attestationResult = await client.createAttestation({
        schemaId: "0x6a",
        data: {
          campaignId: currentCampaignID,
          donorAddress: address,
          Amount: ethers.utils.parseEther(amount.toString()),
          timeStamp: new Date().toISOString(),
        },
        indexingValue: address?.toLowerCase() || "0x",
      })
      toast.info("Attestation created ")
      console.log("Attestation created:", attestationResult)

      setDonationPopUpOpen(false)
    } catch (error: any) {
      console.error("Donation failed", error)
      toast.update(pendingToastId, {
        render: `Transaction Failed`,
        type: "error",
        icon: "❌" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      })
    }
  }

  return (
    <div className="flex flex-col relative  pb-16">
      <h1 className=" text-3xl text-[var(--secondary)]   font-bold">
        Campaigns
      </h1>
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={donationPopUpOpen}
        onClick={handleDonationClose}
      >
        <DonationPopup
          handleClose={handleDonationClose}
          handleDonate={handleDonate}
        />
      </Backdrop>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={campaignPopUpOpen}
        onClick={handleCampaignClose}
      >
        <CampaignPopup handleClose={handleCampaignClose} refetch={refetch} />
      </Backdrop>

      <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        anchor="right"
        disableEnforceFocus
      >
        {selectedCampaign && (
          <DrawerContent
            admin={false}
            donationData={donationData}
            isIndividual={isIndividual}
            campaignData={selectedCampaign}
            handleDonationOpen={handleDonationOpen}
            handleDrawerClose={handleDrawerClose}
            raisedValue={
              BigNumber.from(selectedCampaign.raised) || BigNumber.from(0)
            }
            GoalValue={
              BigNumber.from(selectedCampaign.goal) || BigNumber.from(0)
            }
            LeftValue={BigNumber.from(0)}
            campaignID={selectedCampaign.campaignId || "0"}
            Description={selectedCampaign.description || "null"}
            title={selectedCampaign.title || "null"}
            BgImage={selectedCampaign.coverImage}
          />
        )}
      </Drawer>

      <div className="mt-4">
        {loading ? (
          <div className="h-[70vh] w-[90vw] flex justify-center items-center">
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
          <CampaignCardContainer
            campaignsList={campaignsList}
            handlePopUp={handleDonationOpen}
            handleDrawer={handleDrawerOpen}
          />
        )}
      </div>

      <div className="absolute  right-20 top-12 hidden min-[850px]:flex">
        <Tippy
          placement="top"
          animateFill={true}
          animation={"scale"}
          theme="custom"
          content={`Create new Campaign`}
        >
          <Button
            variant="contained"
            onClick={handleCampaignOpen}
            endIcon={
              <AddIcon
                sx={{
                  color: "var(--Bg)",
                }}
              />
            }
            sx={{
              backgroundColor: "var(--primary)",
              textTransform: "capitalize",

              borderRadius: "6px",
            }}
          >
            New Campaign
          </Button>
        </Tippy>
      </div>

      <div className="fixed bottom-8 right-5 flex min-[850px]:hidden">
        <Tippy
          placement="left"
          animateFill={true}
          animation={"scale"}
          theme="custom"
          content={`Create new Campaign`}
        >
          <button
            className=" rounded-full p-4 bg-[var(--primary)]"
            onClick={handleCampaignOpen}
          >
            <AddIcon
              sx={{
                color: "white",
              }}
            />
          </button>
        </Tippy>
      </div>
    </div>
  )
}

export default Home
