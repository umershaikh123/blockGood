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

    holesky,
    sepolia,

    arbitrumSepolia,

    polygon,
    optimism,
    arbitrum,
  ],
  ssr: true,
})
