import { configureStore, combineReducers, createAction } from "@reduxjs/toolkit"
import balanceReducer from "./balanceslice"
export const resetStore = createAction("reset/RESET_STORE")

const initialBalanceState = {
  SourceChainBalance: "0",
  DestinationChainBalance: "0",
}

const combinedReducer = combineReducers({
  balance: balanceReducer,
})

const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: any
) => {
  if (action.type === resetStore.type) {
    return {
      balance: initialBalanceState,
    }
  }
  return combinedReducer(state, action)
}

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
export const store = makeStore()
export default store
