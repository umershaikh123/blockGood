import axios from "axios"
import { toast } from "react-toastify"
const JWT = process.env.NEXT_PUBLIC_JWT || ""

export const uploadImageToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  const pinataMetadata = JSON.stringify({
    name: file.name,
  })
  formData.append("pinataMetadata", pinataMetadata)

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })
  formData.append("pinataOptions", pinataOptions)

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    )
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
  } catch (error) {
    toast.error("Error uploading image to IPFS")
    console.error("Error uploading image to IPFS:", error)
    throw error
  }
}
