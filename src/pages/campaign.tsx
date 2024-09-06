import { Button, Drawer } from "@mui/material"
import { Backdrop } from "@mui/material"
import {
  RegisterIndividualPopup,
  RegisterOrganizationPopup,
  UploadPOSPopup,
  WithdrawPopup,
} from "../Components/Common/Popup"

import { YourCampaignCardContainer } from "../Components/Common/Card"
import { toast, ToastContainer } from "react-toastify"
import React, { useState, useEffect, use, useMemo } from "react"
import type { NextPage } from "next"
import TabsComponent from "../Components/Common/Tabs"
import { tabsProps } from "../constants/tabs"
import { ToastIcon } from "react-toastify/dist/types"
import AddIcon from "@mui/icons-material/Add"
import Tippy from "@tippyjs/react"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"

import {
  chainConfigs,
  getChainConfig,
  getContractAddress,
} from "../constants/chainConfig"
import donationTrackerAbi from "../contracts/abis/donationTracker.json"
import { ethers, BigNumber } from "ethers"

import "react-toastify/dist/ReactToastify.css"
import { useAccount } from "wagmi"
import { useMutation, useQuery } from "@apollo/client"
import {
  GET_CAMPAIGN_IDS,
  GET_DONATION_RECIEVED,
  GET_PROOF_UPLOADED,
} from "../util/Queries"
import { ThreeDots } from "react-loader-spinner"
import { DrawerContent } from "../Components/Common/Drawer"

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

const campaign = () => {
  const [individualPopUpOpen, setIndividualPopUpOpen] = React.useState(false)

  const handleIndividualClose = () => {
    setIndividualPopUpOpen(false)
  }
  const handleIndividualOpen = () => {
    setIndividualPopUpOpen(true)
  }

  const [WithdrawPopUpOpen, setWithdrawPopUpOpen] = React.useState(false)
  const [UploadPopUpOpen, setUploadPopUpOpen] = React.useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  )
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { data: donationData } = useQuery(GET_DONATION_RECIEVED)
  const { error, data } = useQuery(GET_CAMPAIGN_IDS)
  const { data: proofData } = useQuery(GET_PROOF_UPLOADED)

  const { chain: networkChain, address, isConnected } = useAccount()

  const [campaignsList, setCampaignsList] = useState<Campaign[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isIndividual, setIsIndividual] = useState<boolean>(false)
  const [currentCampaignID, setCurrentCampaignID] = React.useState("")

  const [organizationPopUpOpen, setOrganizationPopUpOpen] =
    React.useState(false)
  const handleOrganizationClose = () => {
    setOrganizationPopUpOpen(false)
  }
  const handleOrganizationOpen = () => {
    setOrganizationPopUpOpen(true)
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

  const fetchCampaignDetails = useMemo(
    () => async () => {
      if (!data) return // Ensure that the data is available
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

          const campaignDetails = await donationContract.getCampaignDetails(
            campaignId
          )

          fetchedCampaigns.push({
            campaignId,
            creator: campaignDetails.creator,
            title: campaignDetails.title,
            description: campaignDetails.description,
            goal: campaignDetails.goal,
            raised: campaignDetails.raised,
            withdrawn: campaignDetails.withdrawn.toNumber(),
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
    },
    [data, networkChain]
  )

  useEffect(() => {
    if (data) {
      fetchCampaignDetails()
    }
  }, [data, fetchCampaignDetails])

  // withdraw(uint256 campaignId, uint256 amount, string memory reason)
  const handleWithdraw = async (amount: number, reason: string) => {
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

      toast.info("withdrawing ...")
      const tx = await ContractSigner.withdraw(
        currentCampaignID,
        // BigNumber.from(reason),
        ethers.utils.parseEther(amount.toString()),
        reason
      )

      const receipt = await tx.wait()
      toast.update(pendingToastId, {
        render: "Withdraw Successful!",
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
          autoClose: 7000,
        }
      )

      setWithdrawPopUpOpen(false)
    } catch (error: any) {
      console.error("Withdraw failed", error)
      toast.update(pendingToastId, {
        render: `Transaction Failed`,
        type: "error",
        icon: "❌" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      })
    }
  }

  type ProofData = {
    campaignId: string
    id: string
    proofUrl: string
    withdrawalId: string
  }

  const handleUploadPOS = async (proofURL: string) => {
    if (!proofData) {
      return
    }

    const filteredProofs = proofData?.DonationTracker_ProofUploaded.filter(
      (proof: ProofData) => proof.campaignId === currentCampaignID
    )
    console.log("PROOF", { proofURL, filteredProofs, currentCampaignID })

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

      const tx = await ContractSigner.uploadWithdrawalProof(
        currentCampaignID,
        filteredProofs.withdrawalId,
        proofURL
      )

      const receipt = await tx.wait()
      toast.update(pendingToastId, {
        render: "Tx Successful!",
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
          autoClose: 7000,
        }
      )
    } catch (error: any) {
      console.error("Tx failed", error)
      toast.update(pendingToastId, {
        render: `Transaction Failed`,
        type: "error",
        icon: "❌" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      })
    }
  }

  const handleEndCampaign = async (campaign: Campaign) => {
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

      const tx = await ContractSigner.endCampaign(campaign.campaignId)

      const receipt = await tx.wait()
      toast.update(pendingToastId, {
        render: "Tx Successful!",
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
          autoClose: 7000,
        }
      )
    } catch (error: any) {
      console.error("Tx failed", error)
      toast.update(pendingToastId, {
        render: `Transaction Failed`,
        type: "error",
        icon: "❌" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      })
    } finally {
      // window.location.reload()
    }
  }

  return (
    <div className="flex flex-col mr-10">
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={individualPopUpOpen}
        onClick={handleIndividualClose}
      >
        <RegisterIndividualPopup handleClose={handleIndividualClose} />
      </Backdrop>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={organizationPopUpOpen}
        onClick={handleOrganizationClose}
      >
        <RegisterOrganizationPopup handleClose={handleOrganizationClose} />
      </Backdrop>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={WithdrawPopUpOpen}
        onClick={() => {
          setWithdrawPopUpOpen(false)
        }}
      >
        <WithdrawPopup
          handleClose={() => {
            setWithdrawPopUpOpen(false)
          }}
          handleWithdraw={handleWithdraw}
        />
      </Backdrop>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={UploadPopUpOpen}
        onClick={() => {
          setUploadPopUpOpen(false)
        }}
      >
        <UploadPOSPopup
          handleClose={() => {
            setUploadPopUpOpen(false)
          }}
          handleUpload={handleUploadPOS}
        />
      </Backdrop>

      <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        anchor="right"
        disableEnforceFocus
      >
        {selectedCampaign && (
          <DrawerContent
            admin={true}
            donationData={donationData}
            isIndividual={isIndividual}
            handleDonationOpen={() => {}}
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
            socialLink={"/"}
            title={selectedCampaign.title || "null"}
            BgImage={selectedCampaign.coverImage}
          />
        )}
      </Drawer>

      <div className="flex  justify-between">
        <h1 className="text-3xl font-semibold ml-6 text-[var(--secondary)]">
          {" "}
          Your Campaign
        </h1>

        <div className=" space-x-6">
          <Tippy
            placement="bottom"
            animateFill={true}
            animation={"scale"}
            theme="custom2"
            content={`Register as Individual`}
          >
            <Button
              variant="outlined"
              sx={{
                color: "var(--primary)",
                bgcolor: "white",
                border: "2px solid var(--primary)",
                width: "full",
                px: "2rem",
                fontWeight: 600,
                borderRadius: "7px",
                ":hover": {
                  bgcolor: "var(--secondary)",
                  color: "white",
                  border: "2px solid var(--secondary)",
                },
              }}
              onClick={event => {
                handleIndividualOpen()
              }}
            >
              Individual
            </Button>
          </Tippy>

          <Tippy
            placement="bottom"
            animateFill={true}
            animation={"scale"}
            theme="custom2"
            content={`Register as Organization`}
          >
            <Button
              variant="outlined"
              sx={{
                color: "var(--Bg)",
                bgcolor: "var(--primary)",
                border: "2px solid var(--primary)",
                width: "full",
                px: "2rem",
                fontWeight: 600,
                borderRadius: "7px",
                ":hover": {
                  bgcolor: "var(--secondary)",
                  color: "white",
                  border: "2px solid var(--secondary)",
                },
              }}
              onClick={event => {
                handleOrganizationOpen()
              }}
            >
              Organization
            </Button>
          </Tippy>
        </div>
      </div>

      <div className=" ml-8 mt-4">
        {isConnected ? (
          <>
            {loading ? ( // Display loading indicator
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
              <YourCampaignCardContainer
                campaignsList={campaignsList}
                handlePopUp={(CampaignID: string) => {
                  setCurrentCampaignID(CampaignID)
                  setWithdrawPopUpOpen(true)
                }}
                handleDrawer={handleDrawerOpen}
                handleEndCampaign={(Campaign: Campaign) => {
                  handleEndCampaign(Campaign)
                }}
                handleUploadPOS={(CampaignID: string) => {
                  setCurrentCampaignID(CampaignID)
                  setUploadPopUpOpen(true)
                }}
              />
            )}
          </>
        ) : (
          <div className="h-[60vh] flex items-center justify-center">
            <h1 className="text-3xl text-[var(--secondary)] text-semibold  px-4 py-2 rounded-xl">
              Please Connect wallet
            </h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default campaign
