import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currencyType: "USD",
  currencySymbol: "$",
};
const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    changeCurrency: (state, action) => {
      state.currencyType = action.payload;
    },
    changeCurrencySymbol: (state, action) => {
      state.currencySymbol = action.payload;
    },
  },
});

export const currencyReducer = currencySlice.reducer;
export const { changeCurrency, changeCurrencySymbol } = currencySlice.actions;
