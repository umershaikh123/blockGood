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
import Image, { StaticImageData } from "next/image"
import c3 from "/public/Images/campaign/c3.svg"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import { Close, Description } from "@mui/icons-material"
// import StandardImageList from "../Components/Common/ImagesRow"
import ImageRowComponent from "../Components/Common/ImagesRow"
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge"
import ProgressBar from "../Components/Common/ProgressBar"
import ForumIcon from "@mui/icons-material/Forum"
import { StatCard } from "../Components/Common/Card"
// import { campaignsList } from "../constants/campaigns"
import { CampaignCardContainer } from "../Components/Common/Card"
import Details from "../Components/Common/Details"
import DonationHistoryTable from "../Components/Common/Table"
import { donationTableData } from "../constants/tableData"
// import { donationTableData } from "../constants/tableData"
import { useQuery } from "@apollo/client"
import { GET_CAMPAIGN_IDS } from "../util/Queries"
import { CampaignType } from "../types/campaign"
import { chainConfigs, getContractAddress } from "../constants/chainConfig"
import donationTrackerAbi from "../contracts/abis/donationTracker.json"
import { ethers } from "ethers"
import { useAccount } from "wagmi"
import { calculateCampaignProgress } from "../util"
import { BigNumber } from "ethers"
import { ThreeDots } from "react-loader-spinner"
import { toast, ToastContainer } from "react-toastify"
import { ToastIcon } from "react-toastify/dist/types"
import "react-toastify/dist/ReactToastify.css"

const drawerTabsProps = [
  {
    label: "Details",
    value: "details",
  },
  {
    label: "Donation History",
    value: "donation History",
  },
  {
    label: "Spending",
    value: "spending",
  },
]

interface DrawerContentProps {
  handleDrawerClose: any
  handleDonationOpen: (campaignID: string) => void
  title: string

  raisedValue: BigNumber
  GoalValue: BigNumber
  LeftValue: BigNumber
  Description: string
  donationTableData: any
  socialLink: string
  BgImage: string
  campaignID: string
}

function DrawerContent({
  handleDrawerClose,
  handleDonationOpen,
  title,

  raisedValue,
  GoalValue,
  LeftValue,
  Description,
  donationTableData,
  socialLink,
  BgImage,
  campaignID,
}: DrawerContentProps) {
  // const [progress, setProgress] = React.useState(0)

  const progress = calculateCampaignProgress({
    raisedValue: raisedValue,
    goalValue: GoalValue,
  })

  return (
    <Box
      sx={{ width: "48rem", borderRadius: "5rem", padding: "1rem" }}
      role="presentation"
    >
      <div className="flex flex-col w-full text-[var(--primary)]">
        <div
          className="flex   justify-start items-center space-x-1"
          onClick={handleDrawerClose}
        >
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 30,
              ":hover": {
                transition: "transform 0.3s ease-in-out",

                transform: "rotate(90deg)",
              },
            }}
          />
          <h1 className="text-2xl font-semibold">Close</h1>
        </div>

        <div className="flex justify-center items-center my-4">
          <img
            src={BgImage}
            width={800}
            height={800}
            alt="Campaign Background"
            className=" rounded-xl"
          />
        </div>
        {/* <div className="flex justify-center items-center my-4">
          <ImageRowComponent />
        </div> */}

        <div className="flex justify-between    items-center my-4 w-full">
          <h1 className="text-3xl font-semibold max-w-[32vw]  w-11/12  ">
            {title}
          </h1>
          <Gauge
            width={80}
            height={80}
            value={progress}
            cornerRadius="50%"
            sx={theme => ({
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 15,
                fontWeight: 700,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: "var(--secondary)",
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: "var(--Bg)",
              },
            })}
          />
        </div>

        <ProgressBar progress={progress} />

        <div className="flex justify-start items-center my-6 w-full space-x-4  ">
          <Button
            variant="outlined"
            sx={{
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              width: "full",
              px: "3rem",
              fontWeight: 600,
              borderRadius: "6px",
              ":hover": {
                bgcolor: "var(--secondary)",
                color: "white",
                border: "2px solid var(--secondary)",
              },
            }}
            onClick={() => handleDonationOpen(campaignID)}
          >
            Donate
          </Button>

          <Button
            variant="outlined"
            startIcon={
              <ForumIcon
                sx={{
                  color: "white",
                }}
              />
            }
            sx={{
              color: "white",
              border: "2px solid var(--primary)",
              bgcolor: "var(--primary)",
              width: "full",
              px: "3rem",
              fontWeight: 600,
              borderRadius: "6px",

              ":hover": {
                bgcolor: "white",
                color: "var(--secondary)",
                border: "2px solid var(--secondary)",
                "& .MuiSvgIcon-root": {
                  color: "var(--secondary)",
                },
              },
            }}
            onClick={() => {
              console.log("chat button clicked")
            }}
          >
            Chat
          </Button>
        </div>

        <div className="max-w-7/12  border-r border-l border-b  border-gray-300 rounded-xl  ">
          <StatCard
            raisedValue={raisedValue}
            GoalValue={GoalValue}
            LeftValue={LeftValue}
          />
        </div>

        <div className="mt-6 min-h-[40vh]">
          <TabsComponent
            tabs={drawerTabsProps}
            component1={
              <>
                <Details
                  description={Description}
                  xLink={socialLink}
                  InstaLink="/"
                  FaceBookLink="/"
                />
              </>
            }
            component2={
              <>
                {campaignID && (
                  <DonationHistoryTable
                    tableData={donationTableData[campaignID] || []}
                  />
                )}
              </>
            }
            component3={<div className="min-h-[30vh]"></div>}
            maxWidth="max-w-[32rem]"
          />
        </div>

        <div className="mb-[1rem]" />
      </div>
    </Box>
  )
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

  const [donationPopUpOpen, setDonationPopUpOpen] = React.useState(false)

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  )
  const [campaignPopUpOpen, setCampaignPopUpOpen] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { chain: networkChain } = useAccount()
  const { loading, error, data } = useQuery(GET_CAMPAIGN_IDS)
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([])
  const [currentCampaignID, setCurrentCampaignID] = React.useState("")

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractAddress = getContractAddress(networkChain?.id || 11155111)
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
      }
    }

    if (data) {
      console.log("data", data)
      fetchCampaignDetails()
    }

    // if (selectedCampaign) {
    //   const raisedValue =
    //     BigNumber.from(selectedCampaign.raised) || BigNumber.from(0)
    //   const goalValue =
    //     BigNumber.from(selectedCampaign.goal) || BigNumber.from(0)
    //   setProgress(calculateCampaignProgress({ raisedValue, goalValue }))
    // }
  }, [data, networkChain, selectedCampaign])

  if (loading)
    return (
      <div>
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
    )
  if (error) return <p>Error : {error.message}</p>

  const handleDonationClose = () => {
    setDonationPopUpOpen(false)
  }
  const handleDonationOpen = (CampaignID: string) => {
    // set campaignID
    setCurrentCampaignID(CampaignID)
    setDonationPopUpOpen(true)
  }

  const handleCampaignClose = () => {
    setCampaignPopUpOpen(false)
  }
  const handleCampaignOpen = () => {
    setCampaignPopUpOpen(true)
  }

  const handleDrawerOpen = (campaign: Campaign) => {
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
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.")
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
      const tx = await ContractSigner.donate(currentCampaignID, {
        value: ethers.utils.parseEther(amount.toString()),
      })

      const receipt = await tx.wait()
      toast.update(pendingToastId, {
        render: "Registration Successful!",
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
    <div className="flex flex-col relative ">
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
        <CampaignPopup handleClose={handleCampaignClose} />
      </Backdrop>

      <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        anchor="right"
        disableEnforceFocus
      >
        {selectedCampaign && (
          <DrawerContent
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
            donationTableData={[]}
            Description={selectedCampaign.description || "null"}
            socialLink={"/"}
            title={selectedCampaign.title || "null"}
            BgImage={selectedCampaign.coverImage}
          />
        )}
      </Drawer>

      <div className="mt-4">
        <TabsComponent
          tabs={tabsProps}
          component1={
            <CampaignCardContainer
              campaignsList={campaignsList}
              handlePopUp={handleDonationOpen}
              handleDrawer={handleDrawerOpen}
            />
          }
          component2={<>Content for Oragnizations campaigns</>}
          component3={<>Content for Individual campaigns</>}
        />
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
          <button className=" rounded-full p-4 bg-[var(--primary)]">
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
