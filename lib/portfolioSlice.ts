import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioItem {
  coinName: string;
  coinSymbol: string;
  coinAmount: number;
  currencyAmount: number; // fiat value of this holding
  date: string;
  id: number;
}

interface PortfolioState {
  portfolio: PortfolioItem[];
  totalFunds: number; // bank money
  totalAssetValue: number; // crypto fiat-equivalent
}

const initialState: PortfolioState = {
  portfolio: [],
  totalFunds: 20000000,
  totalAssetValue: 0,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    buyAsset: (state, action: PayloadAction<PortfolioItem>) => {
      state.portfolio.push(action.payload);
      const amt = Number(action.payload.currencyAmount) || 0;
      state.totalFunds -= amt;
      state.totalAssetValue += amt;
    },

    sellAsset: (state, action: PayloadAction<PortfolioItem>) => {
      const idx = state.portfolio.findIndex(
        (asset) => asset.id === action.payload.id
      );
      if (idx !== -1) {
        const oldValue = Number(state.portfolio[idx].currencyAmount) || 0;
        const newValue = Number(action.payload.currencyAmount) || 0;
        const delta = oldValue - newValue; // fiat sold

        if (delta > 0) {
          state.totalFunds += delta; // moves to bank
          state.totalAssetValue -= delta; // subtracts from assets
        }
        if (action.payload.coinAmount <= 0) {
          state.portfolio.splice(idx, 1); // removes if empty
        } else {
          state.portfolio[idx] = action.payload; // otherwise update
        }
      }
    },

    deleteAsset: (
      state,
      action: PayloadAction<{ id: number; currencyAmount: number }>
    ) => {
      const { id, currencyAmount } = action.payload;
      // removes the asset
      state.portfolio = state.portfolio.filter((asset) => asset.id !== id);
      // adds back to funds
      state.totalFunds += Number(currencyAmount);
      // subtracts from crypto asset value
      state.totalAssetValue -= Number(currencyAmount);
    },
    addFunds: (state, action: PayloadAction<number>) => {
      state.totalFunds += Number(action.payload);
    },
    changeCurrency: (state, action: PayloadAction<PortfolioItem[]>) => {
      state.portfolio = action.payload;
      state.totalAssetValue = action.payload.reduce(
        (sum, p) => sum + Number(p.currencyAmount || 0),
        0
      );
    },
  },
});

export const portfolioReducer = portfolioSlice.reducer;
export const { buyAsset, sellAsset, deleteAsset, addFunds, changeCurrency } =
  portfolioSlice.actions;
