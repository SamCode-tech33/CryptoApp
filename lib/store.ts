import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { coinsReducer } from "./coinsSlice";
import { symbolReducer } from "./symbolSlice";
import { timeReducer } from "./timeSlice";
import { searchReducer } from "./searchSlice";
import { currencyReducer } from "./currencySlice";

const persistConfig = {
  key: "currency",
  storage,
  whitelist: ["currencyType", "currencySymbol"],
};

const persistedCurrencyReducer = persistReducer(persistConfig, currencyReducer);

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    symbol: symbolReducer,
    timePeriod: timeReducer,
    search: searchReducer,
    currency: persistedCurrencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
