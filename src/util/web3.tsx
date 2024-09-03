import { ethers, BigNumber } from "ethers"

import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"

import donationTrackerAbi from "../contracts/abis/donationTracker.json"

import { toast, ToastContainer } from "react-toastify"
import { ToastIcon } from "react-toastify/dist/types"
import "react-toastify/dist/ReactToastify.css"

// export async function fetch_bETHBalance({
//   NETWORK_RPC,
//   DEPOSIT_CONTRACT,
//   USER_ADDRESS,
// }: fetch_bETHBalanceProps) {
//   const provider = new ethers.providers.JsonRpcProvider(NETWORK_RPC)
//   const signer = await provider.getSigner(USER_ADDRESS)
//   const contractAddress = DEPOSIT_CONTRACT
//   const bEthContract = new ethers.Contract(
//     contractAddress,
//     bETHAbiJson as any,
//     signer
//   )

//   const balance = await bEthContract.balanceOf(USER_ADDRESS)
//   const balanceInNumber = ethers.BigNumber.from(balance).toString()
//   let BalanceString = balanceInNumber.toString().split(",")[0]

// }

// export async function DepositETH({
//   ETH_VALUE,
//   RECIPIENT,
//   LZ_FEE,
//   OPTIONS,
//   transferring,
//   CONTRACT_ADDRESS,
//   addRecentTx,
//   token,
//   Dispatch,
//   setSmartContractCalled,
// }) {
//   const { abi: ABI } = DepositAbiJson

//   const provider = new ethers.providers.Web3Provider(window.ethereum)

//   const DepositEth = BigInt(ETH_VALUE) + BigInt(LZ_FEE)

//   if (transferring === false) {
//     const signer = provider.getSigner()
//     const contractAddress = CONTRACT_ADDRESS
//     const depositContract = new ethers.Contract(
//       contractAddress,
//       ABI as any,
//       provider
//     )

//     const ContractSigner = depositContract.connect(signer)
//     const pendingToastId = toast.loading("Transaction Pending...", {
//       icon: "⏳" as unknown as ToastIcon,
//     })
//     try {
//       const tx = await ContractSigner.depositETH(
//         ETH_VALUE,
//         RECIPIENT,
//         LZ_FEE,
//         OPTIONS,
//         {
//           value: DepositEth,
//         }
//       )
//       addRecentTx({
//         hash: `${tx.hash}`,
//         description: `Deposit ${token.symbol} Tx`,
//       })
//       const receipt = await tx.wait()

//       toast.update(pendingToastId, {
//         render: <div>Transaction Successful! </div>,
//         type: "success",
//         icon: "✅" as unknown as ToastIcon,
//         autoClose: 5000,
//         isLoading: false,
//       })

//       toast.info(
//         <div>
//           View LayerZero{" "}
//           <a
//             href={`https://testnet.layerzeroscan.com/tx/${receipt.transactionHash}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ color: "var(--secondary)", textDecoration: "underline" }}
//           >
//             Tx
//           </a>
//         </div>,
//         {
//           autoClose: 7000,
//         }
//       )
//       setTimeout(() => {
//         toast.info(<div>bETH balance will be updated in few mins</div>, {
//           autoClose: 5000,
//         })
//       }, 10000)
//       if (tx) {
//         return true
//       } else {
//         return false
//       }
//     } catch (error: any) {
//   toast.update(pendingToastId, {
//     render: `Transaction Failed`,
//     type: "error",
//     icon: "❌" as unknown as ToastIcon,
//     autoClose: 5000,
//     isLoading: false,
//   })
//     } finally {
//       setTimeout(() => {
//         setSmartContractCalled(true)
//       }, 240000) // 3 min
//       Dispatch(setTransferring(false))
//     }
//   }
// }
