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
import axios from 'axios';

import donationTrackerAbi from "../../contracts/abis/donationTracker.json"
import { getContractAddress } from "../../constants/chainConfig"
import { useAccount } from "wagmi"

const DonationPopup = ({ handleClose }: { handleClose: () => void }) => {
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
          label="Amount"
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
  const [formValues, setFormValues] = React.useState({
    name: "",
    age: "",
    physicalAddress: "",
    phoneNumber: "",
    email: "",
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
    } = formValues

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contractAddress = "0xE8e1D0EC12BDc3eaA3510d898640e13ca48cbb2F" //sepolia
    const donationContract = new ethers.Contract(
      contractAddress,
      donationTrackerAbi,
      provider
    )

    // const ContractSigner = donationContract.connect(signer)
    // const pendingToastId = toast.loading("Transaction Pending...", {
    //   icon: "⏳" as unknown as ToastIcon,
    // })

    // try {
    //   const tx = await ContractSigner.registerOrganization(
    //     name,
    //     taxId,
    //     physicalAddress,
    //     phoneNumber,
    //     email,
    //     website,
    //     socialMedia,
    //     registrationProof
    //   )

    //   const receipt = await tx.wait()
    //   toast.update(pendingToastId, {
    //     render: <div>Transaction Successful! </div>,
    //     type: "success",
    //     icon: "✅" as unknown as ToastIcon,
    //     autoClose: 5000,
    //     isLoading: false,
    //   })
    // } catch (error: any) {
    //   toast.update(pendingToastId, {
    //     render: `Transaction Failed`,
    //     type: "error",
    //     icon: "❌" as unknown as ToastIcon,
    //     autoClose: 5000,
    //     isLoading: false,
    //   })
    // }
  }

  return (
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[40rem] h-full py-8 max-h-[90vh] bg-[var(--Bg)] rounded-xl   items-center relative overflow-auto">
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
          onClick={handleIndividualRegister}
        >
          Register
        </Button>
      </div>
    </div>
  )
}

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMGU0N2YyNC00Y2I3LTRkY2ItYmNlZC03ZGMyMTZjZGYwNTYiLCJlbWFpbCI6InJpdGlrbGFraHdhbmkyOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDZjZjBjYjBmMTRiZWViMGE4YzkiLCJzY29wZWRLZXlTZWNyZXQiOiI0NzYzZmY3MGE1YmNmM2VjOGUwY2RlNGQyYmI5NzFmMTM5MmJhMWNlYzhhOGJlMGQ3ZTM2MmUyYzdmMjJiZTA5IiwiaWF0IjoxNzI1MzA5MjEyfQ.dJtPunpHMniuWGI_ifhjTEwHHrPu6WD8GLcDq8MOV-E";

const uploadImageToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: file.name,
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data`,
        'Authorization': `Bearer ${JWT}`
      }
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw error;
  }
};

export const CampaignPopup = ({ handleClose }: { handleClose: () => void }) => {
  const { chain } = useAccount()
  const { chain: networkChain } = useAccount()
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    goal: "",
    coverImage: null as File | null,
    destinationChainSelector: "",
  })

  useEffect(() => {
    if (networkChain) {
      console.log("Current chain:", networkChain.name, "Chain ID:", networkChain.id)
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
    const { title, description, goal, coverImage, destinationChainSelector } = formValues;
    console.log("Creating campaign with values:", { title, description, goal, coverImage: coverImage?.name, destinationChainSelector });

    if (!title || !description || !goal || !coverImage) {
      console.error("Missing required fields");
      toast.error("Please fill in all fields");
      return;
    }

    const pendingToastId = toast.loading("Uploading image and creating campaign...", {
      icon: "⏳" as unknown as ToastIcon,
    });

    try {
      console.log("Uploading image to IPFS...");
      const coverImageUrl = await uploadImageToIPFS(coverImage);
      console.log("Image uploaded, URL:", coverImageUrl);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const chainId = networkChain?.id || 11155111;
      console.log("Using chain ID:", chainId);
      const contractAddress = getContractAddress(chainId);
      console.log("Contract address:", contractAddress);
      const donationContract = new ethers.Contract(contractAddress, donationTrackerAbi, signer);

      const goalInWei = ethers.utils.parseEther(goal);
      console.log("Goal in Wei:", goalInWei.toString());

      const address = await signer.getAddress();
      console.log("Signer address:", address);
      
      const isIndividual = await donationContract.isRegisteredAsIndividual(address);
      const isOrganization = await donationContract.isRegisteredAsOrganization(address);
      console.log("Is individual:", isIndividual, "Is organization:", isOrganization);
      
      if (!isIndividual && !isOrganization) {
        throw new Error("You must be registered as an individual or organization to create a campaign");
      }

      const requiredFee = isIndividual ? await donationContract.INDIVIDUAL_FEE() : await donationContract.ORGANIZATION_FEE();
      console.log("Required fee:", ethers.utils.formatEther(requiredFee), "ETH");

      console.log("Creating campaign transaction...");
      
      // request account access 
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // create the transaction
      const tx = await donationContract.createCampaign(
        title,
        description,
        goalInWei,
        coverImageUrl,
        destinationChainSelector,
        { value: requiredFee }
      );

      console.log("Transaction sent, waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("Transaction confirmed, receipt:", receipt);

      toast.update(pendingToastId, {
        render: "Campaign created successfully!",
        type: "success",
        icon: "✅" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      });
      handleClose();
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast.update(pendingToastId, {
        render: `Failed to create campaign: ${error.message}`,
        type: "error",
        icon: "❌" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      });
    }
  }

  return (
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[50rem] max-h-[92vh] py-2 bg-[var(--Bg)] rounded-xl items-center relative overflow-y-auto">
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
        <div className="my-4 max-w-[25rem] w-full">
          <p className="text-[var(--primary)] mb-2">Destination Chain:</p>
          <p className="text-[var(--secondary)] font-semibold">{networkChain?.name || 'Unknown Chain'}</p>
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

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log("provider", provider)
    console.log("signer", signer)
    const contractAddress = "0xE8e1D0EC12BDc3eaA3510d898640e13ca48cbb2F" //sepolia
    const donationContract = new ethers.Contract(
      contractAddress,
      donationTrackerAbi,
      provider
    )
    console.log("donationContract", donationContract)
    const ContractSigner = donationContract.connect(signer)
    const pendingToastId = toast.loading("Transaction Pending...", {
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
      toast.update(pendingToastId, {
        render: <div>Transaction Successful! </div>,
        type: "success",
        icon: "✅" as unknown as ToastIcon,
        autoClose: 5000,
        isLoading: false,
      })
      toast.info(
        <div>
          View Tx{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${receipt.transactionHash}`}
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
