import { createSlice } from "@reduxjs/toolkit";

interface portfolioState {
  portfolio: any[];
  totalFunds: number;
  assetValue: number;
}

const initialState: portfolioState = {
  portfolio: [],
  totalFunds: 100000,
  assetValue: 0,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    buyAsset: (state, newState) => {
      state.portfolio = [...state.portfolio, newState.payload];
      state.totalFunds =
        Number(state.totalFunds) -
        Number(newState.payload.currencyAmount.split(",").join(""));
      state.assetValue =
        Number(state.assetValue) +
        Number(newState.payload.currencyAmount.split(",").join(""));
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
            Number(state.totalFunds) +
            Number(newState.payload.currencyAmount.split(",").join(""));
          state.assetValue =
            Number(state.assetValue) -
            Number(newState.payload.currencyAmount.split(",").join(""));
        }
      });
    },
    addFunds: (state, newState) => {
      state.totalFunds = Number(state.totalFunds) + Number(newState.payload);
    },
  },
});

export const portfolioReducer = portfolioSlice.reducer;
export const { buyAsset, sellAsset, deleteAsset, addFunds } =
  portfolioSlice.actions;
