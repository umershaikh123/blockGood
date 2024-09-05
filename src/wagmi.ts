import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  holesky,
  rootstockTestnet,
  rootstock,
  morphHolesky,
  arbitrumSepolia,
} from "wagmi/chains"
import { defineChain } from "viem"

export const Galadriel_testnet = defineChain({
  id: 696969,
  name: "Galadriel Devnet",
  nativeCurrency: { name: "GAL Token", symbol: "GAL", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://devnet.galadriel.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://explorer.galadriel.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 751532,
    },
  },
  testnet: true,
})

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WALLET_ID || "",
  chains: [
    {
      ...rootstock,
      iconUrl: "/Icons/rootStockIcon.png",
    },
    {
      ...rootstockTestnet,
      iconUrl: "/Icons/rootStockIcon.png",
    },

    {
      ...morphHolesky,
      iconUrl: "/Icons/morphIcon.png",
    },

    {
      ...Galadriel_testnet,
      iconUrl: "/Icons/galadrielLogo.png",
    },

    // holesky,
    sepolia,

    // arbitrumSepolia,

    // polygon,
    // optimism,
    // arbitrum,
  ],
  ssr: true,
})
