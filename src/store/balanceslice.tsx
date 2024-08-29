import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface BalanceState {
  SourceChainBalance: string
  DestinationChainBalance: string
}

const initialState: BalanceState = {
  SourceChainBalance: "0.0",
  DestinationChainBalance: "0.0",
}

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    setSourceChainBalance: (state, action: PayloadAction<string>) => {
      state.SourceChainBalance = action.payload
    },

    setDestinationChainBalance: (state, action: PayloadAction<string>) => {
      state.DestinationChainBalance = action.payload
    },
  },
})

export const { setSourceChainBalance, setDestinationChainBalance } =
  balanceSlice.actions
export default balanceSlice.reducer
