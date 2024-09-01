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
const client = new QueryClient()

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
  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider
            theme={myTheme}
            modalSize="compact"
            showRecentTransactions={true}
          >
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
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ReduxProvider>
  )
}

export default MyApp
