// components/Chat.tsx
import React, { useState, useEffect, useCallback } from "react"
import {
  useClient,
  useConversations,
  useCanMessage,
  useStartConversation,
} from "@xmtp/react-sdk"
import { useAccount } from "wagmi"
import { Message, DecodedMessage } from "@xmtp/xmtp-js"
import { CreateClient } from "./CreateClient"
import { ethers, Signer } from "ethers"
import { getChainConfig } from "../../constants/chainConfig"
import {
  isValidAddress,
  getLastMessage,
  useDb,
  getDbInstance,
} from "@xmtp/react-sdk"
import makeBlockie from "ethereum-blockies-base64"

import { differenceInMilliseconds, formatDistanceToNowStrict } from "date-fns"
import { Button, TextField } from "@mui/material"
import { useRouter } from "next/router"
import { toast, ToastContainer } from "react-toastify"
import { ToastIcon } from "react-toastify/dist/types"
import "react-toastify/dist/ReactToastify.css"
import { CreateClientWithKeys } from "./CreateClientWithKeys"
interface CreateClientProps {
  signer: Signer
}

export const Chat: React.FC<CreateClientProps> = ({ signer }) => {
  const { client, initialize } = useClient()
  const [messages, setMessages] = useState<DecodedMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [peerAddress, setPeerAddress] = useState<string>("")
  const [isOnNetwork, setIsOnNetwork] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()

  const {
    conversations,
    error: conversationsError,
    isLoading: isLoadingConversations,
  } = useConversations()
  const { canMessage } = useCanMessage()
  const { startConversation } = useStartConversation()

  const router = useRouter()

  const { creatorAddress } = router.query

  useEffect(() => {
    if (creatorAddress) {
      //@ts-ignore
      setPeerAddress(creatorAddress)
    }
  }, [creatorAddress])

  useEffect(() => {
    const initializeClient = async () => {
      const options = { persistConversations: true }
      await initialize({ signer: signer, options })
    }

    if (address && client === undefined) {
      initializeClient()
    }
  }, [address, client, initialize])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (client && peerAddress) {
          const conversation = await client.conversations.newConversation(
            peerAddress
          )

          const allMessages = await conversation.messages()
          setMessages(allMessages)

          const stream = await conversation.streamMessages()
          for await (const newMsg of stream) {
            setMessages(prevMessages => [...prevMessages, newMsg])
          }
        }
      } catch (error: any) {
        toast.error("Recipient is not on the XMTP network")
        console.log("could not fetch messages :", error)
      }
    }

    if (client) {
      try {
        fetchMessages()
      } catch (error: any) {
        toast.error("Recipient is not on the XMTP network")
        console.log("could not fetch messages :", error)
      }
    }
  }, [client, peerAddress])

  const handleStartConversation = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (isValidAddress(peerAddress) && newMessage) {
        setIsLoading(true)

        try {
          const conversations = await startConversation(peerAddress, newMessage)

          setIsLoading(false)

          if (conversations && conversations.conversation?.peerAddress) {
            setPeerAddress(conversations.conversation?.peerAddress)

            setMessages([...(await conversations.conversation.messages())])
          }
        } catch (error: any) {
          toast.error("Could not fetch messages")
          console.log("could not fetch messages :", error)
        }
      }
    },
    [peerAddress, newMessage, startConversation]
  )

  const handleCheckAddress = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault()
        if (isValidAddress(peerAddress)) {
          setIsLoading(true)
          setIsOnNetwork(await canMessage(peerAddress))
          setIsLoading(false)
        } else {
          setIsOnNetwork(false)
        }
      } catch (error: any) {
        toast.error("address is not valid")
        console.log("could not fetch messages :", error)
      }
    },
    [peerAddress, canMessage]
  )
  const shortenAddress = (address: string) => {
    if (!address) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="p-4 relative   ">
      {/* <CreateClient signer={signer} /> */}
      {address && <CreateClientWithKeys signer={signer} address={address} />}
      <div className="flex  ">
        <div className="border border-[var(--secondary)] flex flex-col  max-w-[22rem] h-[70vh] overflow-auto rounded-xl w-full">
          {isLoadingConversations && (
            <div className="m-4 text-[var(--primary)]">
              Loading conversations...
            </div>
          )}
          {conversationsError && (
            <div className="m-4 text-[var(--primary)]">
              Error loading conversations
            </div>
          )}
          <ul>
            {conversations.map(conversation => (
              <div
                key={conversation.peerAddress}
                onClick={() => setPeerAddress(conversation.peerAddress)}
                className=" w-full bg-[var(--Bg)] py-4 border-b border-[var(--secondary)] flex   items-center px-4 space-x-3 hover:bg-gray-100 transition-all duration-300 ease-in-out"
              >
                <div>
                  <img
                    src={makeBlockie(conversation.peerAddress)}
                    width={40}
                    height={40}
                    className=" rounded-full"
                  />
                </div>

                <div className=" font-semibold text-[var(--primary)]">
                  {shortenAddress(conversation.peerAddress)}
                </div>

                <div className=" font-semibold text-[var(--primary)]">
                  {formatDistanceToNowStrict(new Date(conversation.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))}
          </ul>
        </div>

        <div className="   w-full h-fit   flex flex-col items-center justify-center  ">
          <form
            onSubmit={handleCheckAddress}
            className="flex mb-2    justify-start items-center"
          >
            <div className="min-w-[44rem] w-fit items-center  rounded-lg flex   flex-col  justify-between  ">
              {/* <div>
                {!isOnNetwork && (
                  <div className="text-red-500 ml-4    ">
                    Address is not on the XMTP network.
                  </div>
                )}
              </div> */}

              <div className="min-w-[44rem] w-fit items-center  rounded-lg flex      justify-between  ">
                <h1 className=" text-xl text-[var(--primary)] mr-4 ">To:</h1>
                <TextField
                  name="Address"
                  type="text"
                  label="Address"
                  multiline
                  placeholder="Enter address of receiver ..."
                  value={peerAddress}
                  onChange={e => setPeerAddress(e.target.value)}
                  sx={{
                    flexGrow: 1,

                    maxWidth: "28rem",
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
                  disabled={isLoading}
                  type="submit"
                  sx={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    minWidth: "10rem",
                    marginLeft: "1rem",
                    border: "2px solid var(--primary)",
                    textTransform: "capitalize",
                    px: "1rem",
                    py: "4px",
                    fontWeight: 600,
                    borderRadius: "0.5rem",
                    ":hover": {
                      bgcolor: "white",
                      color: "var(--primary)",
                      border: "2px solid var(--primary)",
                    },
                  }}
                >
                  Check Address
                </Button>
              </div>
            </div>
          </form>
          {isOnNetwork && (
            <form
              onSubmit={handleStartConversation}
              className="flex mb-4 w-[35vw] items-center absolute bottom-0 ml-10  "
            >
              <TextField
                name="Message"
                disabled={isLoading || !isValidAddress(peerAddress)}
                type="text"
                label="Enter message"
                multiline
                placeholder="Enter Message ..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                sx={{
                  mr: "1rem",
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
                disabled={isLoading || !isValidAddress(peerAddress)}
                type="submit"
                sx={{
                  backgroundColor: "var(--secondary)",
                  color: "white",
                  minWidth: "5rem",
                  border: "2px solid var(--secondary)",
                  textTransform: "capitalize",
                  px: "2rem",
                  py: "4px",
                  fontWeight: 600,
                  borderRadius: "0.5rem",
                  ":hover": {
                    bgcolor: "white",
                    color: "var(--secondary)",
                    border: "2px solid var(--secondary)",
                  },
                }}
              >
                Send
              </Button>
            </form>
          )}
          <div className="overflow-y-auto mb-4 h-[55vh] p-4  rounded-xl bg-[var(--Bg)] flex flex-col w-full max-w-[45rem]    ">
            {messages.map((msg, index) => (
              <>
                {msg.senderAddress === address ? (
                  <div className="w-full flex justify-start ">
                    <div
                      key={index}
                      className={`mb-2 px-4 py-2 max-w-[25rem] text-[var(--Bg)] rounded bg-[var(--primary)] text-left justify-start  `}
                    >
                      {msg.senderAddress && (
                        <span
                          className={`flex text-xs text-[var(--Bg)] justify-start `}
                        >
                          <div>Me</div>
                        </span>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full flex justify-end  ">
                      <div
                        key={index}
                        className={`mb-2 px-4 py-2 max-w-[25rem] text-[var(--Bg)] rounded bg-[var(--secondary)] text-right justify-end   `}
                      >
                        {msg.senderAddress && (
                          <span
                            className={`flex text-xs text-[var(--Bg)] justify-end `}
                          >
                            <div>Reciever ( {msg.senderAddress} ) </div>
                          </span>
                        )}
                        {msg.content}
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
