import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"

import type { AppProps } from "next/app"
import { Provider as ReduxProvider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

import { config } from "../wagmi"
import store from "../store"

const client = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ReduxProvider>
  )
}

export default MyApp
