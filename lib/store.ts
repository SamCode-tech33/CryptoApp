import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { coinsReducer } from "./coinsSlice";
import { symbolReducer } from "./symbolSlice";
import { timeReducer } from "./timeSlice";
import { searchReducer } from "./searchSlice";
import { currencyReducer } from "./currencySlice";
import { portfolioReducer } from "./portfolioSlice";

const currencyPersistConfig = {
  key: "currency",
  storage,
  whitelist: ["currencyType", "currencySymbol"],
};

const portfolioPersistConfig = {
  key: "portfolio",
  storage,
  whitelist: ["portfolio", "totalFunds", "assetValue"],
};

const persistedCurrencyReducer = persistReducer(
  currencyPersistConfig,
  currencyReducer
);

const persistedPortfolioReducer = persistReducer(
  portfolioPersistConfig,
  portfolioReducer
);

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    symbol: symbolReducer,
    timePeriod: timeReducer,
    search: searchReducer,
    currency: persistedCurrencyReducer,
    portfolio: persistedPortfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
