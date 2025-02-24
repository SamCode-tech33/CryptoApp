import { configureStore } from "@reduxjs/toolkit";
import { coinsReducer } from "./coinsSlice";
import { symbolReducer } from "./symbolSlice";
import { timeReducer } from "./timeSlice";

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    symbol: symbolReducer,
    timePeriod: timeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
