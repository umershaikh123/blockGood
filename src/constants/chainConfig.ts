export interface NativeCurrency {
  decimals: number
  name: string
  symbol: string
}

export interface RpcUrls {
  default: { http: string[] }
  public: { http: string[] }
}

export interface BlockExplorer {
  name: string
  url: string
}

export interface ChainConfig {
  id: number
  name: string
  network: string
  nativeCurrency: NativeCurrency
  rpcUrls: RpcUrls
  blockExplorers: {
    default: BlockExplorer
  }
  testnet: boolean
  contractAddress: string
}

export const chainConfigs: { [key: number]: ChainConfig } = {
  11155111: {
    id: 11155111,
    name: "Sepolia",
    network: "sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Sepolia Ether",
      symbol: "SEP",
    },
    rpcUrls: {
      default: {
        http: [
          `${
            process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"
          }`,
        ],
      },
      public: {
        http: [
          `${
            process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"
          }`,
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Sepolia Etherscan",
        url: "https://sepolia.etherscan.io",
      },
    },
    testnet: true,
    contractAddress: "0x7167C5B16dA69Ba6C0Ba00710Bd828B552486bD9",
  },
  31: {
    id: 31,
    name: "Rootstock Testnet",
    network: "rootstock-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Rootstock Testnet BTC",
      symbol: "tRBTC",
    },
    rpcUrls: {
      default: {
        http: ["https://public-node.testnet.rsk.co"],
      },
      public: {
        http: ["https://public-node.testnet.rsk.co"],
      },
    },
    blockExplorers: {
      default: {
        name: "RSK Testnet Explorer",
        url: "https://explorer.testnet.rsk.co",
      },
    },
    testnet: true,
    contractAddress: "0x1234567890123456789012345678901234567890",
  },
  1337: {
    id: 1337,
    name: "Morph Holesky",
    network: "morph-holesky",
    nativeCurrency: {
      decimals: 18,
      name: "Morph Holesky ETH",
      symbol: "mHETH",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc-quicknode-holesky.morphl2.io"],
      },
      public: {
        http: ["https://rpc-quicknode-holesky.morphl2.io"],
      },
    },
    blockExplorers: {
      default: {
        name: "Morph Holesky Explorer",
        url: "https://explorer-holesky.morphl2.io",
      },
    },
    testnet: true,
    contractAddress: "0x9876543210987654321098765432109876543210",
  },

  696969: {
    id: 696969,
    name: "Galadriel Devnet",
    network: "galadriel-devnet",
    nativeCurrency: { name: "GAL Token", symbol: "GAL", decimals: 18 },
    rpcUrls: {
      default: {
        http: ["https://devnet.galadriel.com"],
      },
      public: {
        http: ["https://devnet.galadriel.com"],
      },
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://explorer.galadriel.com",
      },
    },
    testnet: true,
    contractAddress: "0x1cf52A8D389b6821bf53e5c2787DA872d56dB1F1",
  },
}

export const getChainConfig = (chainId: number): ChainConfig => {
  const config = chainConfigs[chainId]
  if (!config) {
    throw new Error(`Chain configuration not found for chain ID ${chainId}`)
  }
  return config
}

export const getContractAddress = (chainId: number): string => {
  return getChainConfig(chainId).contractAddress
}

export const galadrielContractAddress =
  "0x83eb14Ff452E5E2139773e58d1129820304CaCb2"
