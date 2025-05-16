import { createSlice } from "@reduxjs/toolkit";

interface portfolioState {
  portfolio: any[];
  totalFunds: number;
  assetValue: number;
}

const initialState: portfolioState = {
  portfolio: [],
  totalFunds: 20000000,
  assetValue: 0,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    buyAsset: (state, newState) => {
      state.portfolio = [...state.portfolio, newState.payload];
      state.totalFunds =
        Number(state.totalFunds) - Number(newState.payload.currencyAmount);
      state.assetValue =
        Number(state.assetValue) + Number(newState.payload.currencyAmount);
    },
    sellAsset: (state, newState) => {
      state.portfolio = state.portfolio.map((asset) => {
        if (asset.id === newState.payload.id) {
          return newState.payload;
        } else {
          return asset;
        }
      });
    },
    deleteAsset: (state, newState) => {
      state.portfolio = state.portfolio.filter((asset) => {
        if (asset.id !== newState.payload.id) {
          return asset;
        } else {
          state.totalFunds =
            Number(state.totalFunds) + Number(newState.payload.currencyAmount);
          state.assetValue =
            Number(state.assetValue) - Number(newState.payload.currencyAmount);
        }
      });
    },
    addFunds: (state, newState) => {
      state.totalFunds = Number(state.totalFunds) + Number(newState.payload);
    },
    assetChange: (state, newState) => {
      state.assetValue = Number(state.assetValue) - Number(newState.payload);
    },
    changeCurrency: (state, newState) => {
      state.totalFunds =
        state.totalFunds *
        (newState.payload[0].currencyAmount /
          state.portfolio[0].currencyAmount);
      state.assetValue =
        state.assetValue *
        (newState.payload[0].currencyAmount /
          state.portfolio[0].currencyAmount);
      state.portfolio = newState.payload;
    },
  },
});

export const portfolioReducer = portfolioSlice.reducer;
export const {
  buyAsset,
  sellAsset,
  deleteAsset,
  addFunds,
  changeCurrency,
  assetChange,
} = portfolioSlice.actions;
