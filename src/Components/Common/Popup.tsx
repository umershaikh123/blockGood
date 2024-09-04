import React, { useState, useEffect } from "react"
import { Button } from "@mui/material"
import { Close } from "@mui/icons-material"
import TextField from "@mui/material/TextField"
import PhotoIcon from "@mui/icons-material/Photo"
import InputAdornment from "@mui/material/InputAdornment"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { ethers, BigNumber } from "ethers"
import { toast, ToastContainer } from "react-toastify"
import { ToastIcon } from "react-toastify/dist/types"
import "react-toastify/dist/ReactToastify.css"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import axios from "axios"

import donationTrackerAbi from "../../contracts/abis/donationTracker.json"
import {
  chainConfigs,
  getChainConfig,
  getContractAddress,
} from "../../constants/chainConfig"
import { useAccount } from "wagmi"
import { donatationTracker_contractAddresses } from "../../constants/contracts"
import { uploadImageToIPFS } from "../../util/ipfs"

const DonationPopup = ({
  handleClose,
  handleDonate,
}: {
  handleClose: () => void
  handleDonate: any
}) => {
  const [amount, setAmount] = React.useState("0")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    console.log("amount", amount)
    setAmount(value)
  }
  return (
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[26rem] h-[20rem] bg-[var(--Bg)] rounded-xl justify-evenly items-center relative">
        <div className=" absolute top-2 right-5" onClick={handleClose}>
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 40,
              ":hover": {
                transition: "transform 0.3s ease-in-out",

                transform: "rotate(90deg)",
              },
            }}
          />
        </div>
        <h1 className=" text-4xl text-[var(--primary)] font-semibold">
          Donate
        </h1>
        <TextField
          type="number"
          label="Amount (ETH)"
          onChange={handleInputChange}
          value={amount}
          placeholder="Enter Donation amount..."
          InputProps={{
            inputProps: { step: "0.01" },
          }}
          sx={{
            maxWidth: "20rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary)",
            color: "var(--Bg)",
            textTransform: "capitalize",
            px: "3rem",
            py: "4px",
            fontWeight: 500,
            borderRadius: "0.3rem",
          }}
          onClick={() => handleDonate(amount)}
        >
          Donate
        </Button>
      </div>
    </div>
  )
}

export const RegisterIndividualPopup = ({
  handleClose,
}: {
  handleClose: () => void
}) => {
  const { chain: networkChain } = useAccount()
  const [formValues, setFormValues] = React.useState({
    name: "",
    physicalAddress: "",
    phoneNumber: "",
    email: "",
    age: "",
    Purpose: "", // medicalCondition: "",
    requiredTreatment: "",
    timeline: "",
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: files ? files[0] : value,
    }))
  }

  const handleIndividualRegister = async () => {
    const {
      name,
      physicalAddress,
      phoneNumber,
      email,
      age,
      Purpose, // medicalCondition
      requiredTreatment,
      timeline,
    } = formValues

    if (
      !name ||
      !physicalAddress ||
      !phoneNumber ||
      !email ||
      !age ||
      !Purpose ||
      !requiredTreatment ||
      !timeline
    ) {
      console.error("Missing required fields")
      toast.error("Please fill in all fields")
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

      const tx = await ContractSigner.registerIndividual(
        name,
        age,
        physicalAddress,
        Purpose, // medicalCondition
        requiredTreatment,
        timeline,
        email,
        phoneNumber
      )

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
    } catch (error: any) {
      console.error("Error during registration:", error)

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
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[40rem] h-full py-8 max-h-[94vh] bg-[var(--Bg)] rounded-xl   items-center relative overflow-auto">
        <div className="absolute top-2 right-5" onClick={handleClose}>
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 40,
              ":hover": {
                transition: "transform 0.3s ease-in-out",
                transform: "rotate(90deg)",
              },
            }}
          />
        </div>
        <h1 className="text-4xl text-[var(--primary)] font-semibold my-4">
          Register Individual
        </h1>

        {/** Render TextField components for each form input, with the appropriate name and value */}
        <TextField
          name="name"
          type="text"
          label="Name"
          placeholder="Enter your Name ..."
          value={formValues.name}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="physicalAddress"
          type="text"
          label="Physical Address"
          placeholder="Enter physical address ..."
          value={formValues.physicalAddress}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="phoneNumber"
          type="text"
          label="Phone Number"
          placeholder="Enter your phone number ..."
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="age"
          type="text"
          label="Age"
          placeholder="Enter your age number ..."
          value={formValues.age}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="Purpose"
          type="text"
          label="Purpose"
          placeholder="Enter your campaign Purpose ..."
          value={formValues.Purpose}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="requiredTreatment"
          type="text"
          label="Require"
          placeholder="Enter what you require ..."
          value={formValues.requiredTreatment}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="timeline"
          type="text"
          label="Timeline"
          placeholder="Enter timeline of your expenses ..."
          value={formValues.timeline}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email..."
          value={formValues.email}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary)",
            color: "var(--Bg)",
            textTransform: "capitalize",
            px: "3rem",
            py: "4px",
            fontWeight: 500,
            borderRadius: "0.3rem",
          }}
          onClick={handleIndividualRegister}
        >
          Register
        </Button>
      </div>
    </div>
  )
}

export const CampaignPopup = ({ handleClose }: { handleClose: () => void }) => {
  const { chain: networkChain, isConnected, address } = useAccount()
  const [requiredFee, setRequiredFee] = React.useState<string>("0")
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    goal: "",
    coverImage: null as File | null,
    destinationChainSelector: "",
  })

  useEffect(() => {
    const handleFee = async () => {
      if (isConnected && address) {
        const chainConfig = getChainConfig(networkChain?.id || 11155111)
        const provider = new ethers.providers.JsonRpcProvider(
          chainConfig.rpcUrls.public.http[0]
        )
        const signer = provider.getSigner()

        const chainId = networkChain?.id || 11155111

        const contractAddress = getContractAddress(chainId)

        const donationContract = new ethers.Contract(
          contractAddress,
          donationTrackerAbi,
          provider
        )

        const isIndividual = await donationContract.isRegisteredAsIndividual(
          address
        )

        const requiredFee = isIndividual
          ? BigInt(7300000000000000)
          : BigInt(36000000000000000)

        const requiredFeeEther = ethers.utils.formatUnits(requiredFee, 18)
        console.log("requiredFeeEther ", requiredFeeEther)
        setRequiredFee(requiredFeeEther.toString())
      }
    }

    handleFee()
  }, [isConnected])

  useEffect(() => {
    if (networkChain) {
      console.log(
        "Current chain:",
        networkChain.name,
        "Chain ID:",
        networkChain.id
      )
      setFormValues(prevValues => ({
        ...prevValues,
        destinationChainSelector: networkChain.id.toString(),
      }))
    }
  }, [networkChain])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target
    console.log(`Input changed: ${name} = ${files ? files[0]?.name : value}`)
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: files ? files[0] : value,
    }))
  }

  const handleCreateCampaign = async () => {
    const { title, description, goal, coverImage, destinationChainSelector } =
      formValues
    console.log("Creating campaign with values:", {
      title,
      description,
      goal,
      coverImage: coverImage?.name,
      destinationChainSelector,
    })

    if (!title || !description || !goal || !coverImage) {
      console.error("Missing required fields")
      toast.error("Please fill in all fields")
      return
    }

    const pendingToastId = toast.loading(
      "Uploading image and creating campaign...",
      {
        icon: "⏳" as unknown as ToastIcon,
      }
    )

    try {
      console.log("Uploading image to IPFS...")
      const coverImageUrl = await uploadImageToIPFS(coverImage)
      console.log("Image uploaded, URL:", coverImageUrl)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const chainId = networkChain?.id || 11155111
      console.log("Using chain ID:", chainId)
      const contractAddress = getContractAddress(chainId)
      console.log("Contract address:", contractAddress)
      const donationContract = new ethers.Contract(
        contractAddress,
        donationTrackerAbi,
        signer
      )

      const goalInWei = ethers.utils.parseEther(goal)
      console.log("Goal in Wei:", goalInWei.toString())

      const address = await signer.getAddress()
      console.log("Signer address:", address)

      const isIndividual = await donationContract.isRegisteredAsIndividual(
        address
      )
      const isOrganization = await donationContract.isRegisteredAsOrganization(
        address
      )
      // const [isIndividual, isOrganization] = await Promise.all([
      //   donationContract.isRegisteredAsIndividual(address),
      //   donationContract.isRegisteredAsOrganization(address),
      // ])
      console.log(
        "Is individual:",
        isIndividual,
        "Is organization:",
        isOrganization
      )

      if (!isIndividual && !isOrganization) {
        throw new Error(
          "You must be registered as an individual or organization to create a campaign"
        )
      }

      // const requiredFee = isIndividual
      //   ? await donationContract.INDIVIDUAL_FEE()
      //   : await donationContract.ORGANIZATION_FEE()

      // const requiredFee = isIndividual ? "0.0073" : "0.036"

      const requiredFee = isIndividual
        ? BigInt(7300000000000000)
        : BigInt(36000000000000000)

      console.log("Creating campaign transaction...")

      // request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // create the transaction
      const tx = await donationContract.createCampaign(
        title,
        description,
        goalInWei,
        coverImageUrl,
        destinationChainSelector,
        { value: requiredFee }
      )

      console.log("Transaction sent, waiting for confirmation...")
      const receipt = await tx.wait()
      console.log("Transaction confirmed, receipt:", receipt)

      toast.update(pendingToastId, {
        render: "Campaign created successfully!",
        type: "success",
        icon: "✅" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
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

      handleClose()
    } catch (error: any) {
      console.error("Error creating campaign:", error)
      toast.update(pendingToastId, {
        render: `Failed to create campaign: ${error.message}`,
        type: "error",
        icon: "❌" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      })
    }
  }

  return (
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[40rem] max-h-[92vh] py-6 bg-[var(--Bg)] rounded-xl items-center relative overflow-y-auto">
        <div className="absolute top-2 right-5" onClick={handleClose}>
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 40,
              ":hover": {
                transition: "transform 0.3s ease-in-out",
                transform: "rotate(90deg)",
              },
            }}
          />
        </div>
        <h1 className="text-4xl text-[var(--primary)] font-semibold my-4">
          Create Campaign
        </h1>

        <TextField
          name="title"
          type="text"
          label="Title"
          placeholder="Enter title of the campaign ..."
          value={formValues.title}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="description"
          type="text"
          label="Description"
          multiline
          placeholder="Enter Description of the campaign ..."
          value={formValues.description}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="goal"
          type="number"
          label="Goal (in ETH)"
          placeholder="Enter Goal of the campaign ..."
          value={formValues.goal}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="coverImage"
          type="file"
          label="Cover Image"
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {/* Remove the TextField for destinationChainSelector and replace it with a read-only display */}
        <div className="mb-4 max-w-[25rem] w-full">
          <div className="flex flex-col">
            <h1 className="text-[var(--primary)] font-medium ">
              Reqired Fee :{" "}
            </h1>
            <h1 className="text-[var(--primary)]  mb-2">{requiredFee} ETH</h1>
          </div>
          <p className="text-[var(--primary)] mb-2 text-lg">
            Destination Chain:
          </p>
          <div className="flex justify-center item border border-[var(--primary)] py-3  rounded-sm">
            <p className="text-[var(--primary)] font-medium  ">
              {networkChain?.name || "Unknown Chain"}
            </p>
          </div>
        </div>

        <Button
          variant="contained"
          onClick={handleCreateCampaign}
          sx={{
            backgroundColor: "var(--primary)",
            color: "var(--Bg)",
            textTransform: "capitalize",
            px: "3rem",
            py: "4px",
            fontWeight: 500,
            borderRadius: "0.3rem",
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}

export const RegisterOrganizationPopup = ({
  handleClose,
}: {
  handleClose: () => void
}) => {
  const { chain: networkChain } = useAccount()

  const [formValues, setFormValues] = React.useState({
    name: "",
    taxId: "",
    physicalAddress: "",
    phoneNumber: "",
    email: "",
    website: "",
    socialMedia: "",
    registrationProof: null as File | null,
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: files ? files[0] : value,
    }))
  }

  const handleOrganizationRegister = async () => {
    const {
      name,
      taxId,
      physicalAddress,
      phoneNumber,
      email,
      website,
      socialMedia,
      registrationProof,
    } = formValues

    if (
      !name ||
      !physicalAddress ||
      !phoneNumber ||
      !email ||
      !website ||
      !socialMedia
    ) {
      console.error("Missing required fields")
      toast.error("Please fill in all fields")
      return
    }

    if (!registrationProof) {
      toast.error("Please upload the registration proof")
      return
    }

    const pendingToastId = toast.loading("Uploading image to IPFS...", {
      icon: "⏳" as unknown as ToastIcon,
    })

    console.log("Uploading image to IPFS...")
    const registrationProofUrl = await uploadImageToIPFS(registrationProof)

    console.log("Image uploaded, URL:", registrationProofUrl)

    toast.update(pendingToastId, {
      render: "Image uploaded successfully",
      type: "success",
      icon: "✅" as unknown as ToastIcon,
      autoClose: 3000,
      isLoading: false,
    })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contractAddress =
      chainConfigs[networkChain?.id || 11155111].contractAddress

    // const contractAddress = "0xE35DE3EF40C8E86F1B9D467D76C6DC3408aBCDD0"
    const donationContract = new ethers.Contract(
      contractAddress,
      donationTrackerAbi,
      provider
    )
    console.log("donationContract", donationContract)
    const ContractSigner = donationContract.connect(signer)
    const pendingTxToastId = toast.loading("Transaction Pending...", {
      icon: "⏳" as unknown as ToastIcon,
    })

    try {
      const tx = await ContractSigner.registerOrganization(
        name,
        taxId,
        physicalAddress,
        phoneNumber,
        email,
        website,
        socialMedia,
        registrationProof
      )

      const receipt = await tx.wait()
      toast.update(pendingTxToastId, {
        render: <div>Transaction Successful! </div>,
        type: "success",
        icon: "✅" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
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
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[40rem] h-[92vh] bg-[var(--Bg)] rounded-xl   items-center relative overflow-auto">
        <div className="absolute top-2 right-5" onClick={handleClose}>
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 40,
              ":hover": {
                transition: "transform 0.3s ease-in-out",
                transform: "rotate(90deg)",
              },
            }}
          />
        </div>
        <h1 className="text-4xl text-[var(--primary)] font-semibold my-4">
          Register Organization
        </h1>

        <TextField
          name="name"
          type="text"
          label="Name"
          placeholder="Enter your Name ..."
          value={formValues.name}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="taxId"
          type="text"
          label="Tax ID"
          placeholder="Enter your tax ID ..."
          value={formValues.taxId}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="physicalAddress"
          type="text"
          label="Physical Address"
          placeholder="Enter physical address ..."
          value={formValues.physicalAddress}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="phoneNumber"
          type="text"
          label="Phone Number"
          placeholder="Enter your phone number ..."
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email..."
          value={formValues.email}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="website"
          type="text"
          label="Website"
          placeholder="Enter website ..."
          value={formValues.website}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="socialMedia"
          type="text"
          label="Social Media"
          placeholder="Enter social media link ..."
          value={formValues.socialMedia}
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="registrationProof"
          type="file"
          label="Proof of Identity"
          onChange={handleInputChange}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary)",
            color: "var(--Bg)",
            textTransform: "capitalize",
            px: "3rem",
            py: "4px",
            fontWeight: 500,
            borderRadius: "0.3rem",
          }}
          onClick={handleOrganizationRegister}
        >
          Register
        </Button>
      </div>
    </div>
  )
}

export function RowRadioButtonsGroup() {
  return (
    <div className=" min-w-[25rem]   flex justify-center items-center">
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          sx={{
            color: "var(--secondary)",
            "&.Mui-checked": {
              color: "var(--secondary)",
            },
          }}
        >
          <FormControlLabel
            value="organization"
            control={
              <Radio
                sx={{
                  color: "var(--secondary)",
                  "&.Mui-checked": {
                    color: "var(--primary)",
                  },
                }}
              />
            }
            label="Organization"
            sx={{ color: "var(--primary)" }}
          />
          <FormControlLabel
            value="individual"
            control={
              <Radio
                sx={{
                  color: "var(--primary)",
                  "&.Mui-checked": {
                    color: "var(--primary)",
                  },
                }}
              />
            }
            label="Individual"
            sx={{ color: "var(--secondary)" }}
          />
        </RadioGroup>
      </FormControl>
    </div>
  )
}

export default DonationPopup
