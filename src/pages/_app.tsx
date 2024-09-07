import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"

import type { AppProps } from "next/app"
import { Provider as ReduxProvider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import {
  ConnectButton,
  RainbowKitProvider,
  Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit"
import { config } from "../wagmi"
import store from "../store"
import ResponsiveAppBar from "../Components/Common/navbar"
import merge from "lodash.merge"
import CustomSidebar from "../Components/Common/SideBar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { graphClient } from "../util/graphClient"
import { XMTPProvider } from "@xmtp/react-sdk"
import { useState, useEffect } from "react"
const client = new QueryClient()

interface CustomTheme {
  "--primary": string
  "--secondary": string
  "--Bg": string
}
// Def
// Define themes with CSS variable values
const themes: { [key: string]: CustomTheme } = {
  ForestGreen: {
    "--primary": "#283618",
    "--secondary": "#606c38",
    "--Bg": "#fefae0",
  },

  Turquoise: {
    "--primary": "#073B4C",
    "--secondary": "#118AB2",
    "--Bg": "#06D6A0",
  },
  NavyNight: {
    "--primary": "#003049",
    "--secondary": "#034D73",
    "--Bg": "#FDF0D5",
  },
  SkyBlue: {
    "--primary": "#0077B6",
    "--secondary": "#00B4D8",
    "--Bg": "#CAF0F8",
  },
  PinkPeach: {
    "--primary": "#FB6F92",
    "--secondary": "#FF8FAB",
    "--Bg": "#FFE5EC",
  },

  OrangePeel: {
    "--primary": "#EF476F",
    "--secondary": "#EF476F",
    "--Bg": "#FFD166",
  },
}

export const myTheme = merge(lightTheme(), {
  colors: {
    accentColor: "var(--secondary)",
    connectButtonBackground: "var(--Bg)",
    connectButtonInnerBackground: "var(--Bg)",
    modalBackground: "var(--Bg)",
    profileForeground: "var(--Bg)",
  },
} as Theme)

function MyApp({ Component, pageProps }: AppProps) {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTheme") || "ForestGreen"
    }
    return "ForestGreen"
  })

  useEffect(() => {
    const root = document.documentElement
    const themeVariables = themes[selectedTheme as keyof typeof themes]

    for (const [key, value] of Object.entries(themeVariables)) {
      root.style.setProperty(key, value)
    }

    localStorage.setItem("selectedTheme", selectedTheme)
  }, [selectedTheme])

  return (
    <ReduxProvider store={store}>
      <XMTPProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider
              theme={myTheme}
              modalSize="compact"
              showRecentTransactions={true}
            >
              <ApolloProvider client={graphClient}>
                <ToastContainer
                  theme="light"
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  toastStyle={{
                    backgroundColor: "var(--Bg)",
                    color: "var(--primary)",
                  }}
                  toastClassName="custom-toast"
                />
                <ResponsiveAppBar
                  endComponent={<ConnectButton />}
                  copyright="© 2024 BlockGood, Inc."
                />

                <CustomSidebar />

                <div className="ml-28 mt-4  ">
                  <Component {...pageProps} />
                </div>
              </ApolloProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </XMTPProvider>
    </ReduxProvider>
  )
}

export default MyApp
