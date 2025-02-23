import { configureStore } from "@reduxjs/toolkit";
import { coinsReducer } from "./coinsSlice";
import { symbolReducer } from "./symbolSlice";

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    symbol: symbolReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
