import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sym: "BTC",
  compare: "",
  isCompare: false,
};
const symbolSlice = createSlice({
  name: "symbol",
  initialState,
  reducers: {
    changeGraph: (state, newState) => {
      if (!state.isCompare) {
        state.sym = newState.payload;
      } else {
        state.compare = newState.payload;
      }
    },
    setCompare: (state) => {
      state.isCompare = !state.isCompare;
      state.compare = "";
    },
  },
});

export const symbolReducer = symbolSlice.reducer;
export const { changeGraph, setCompare } = symbolSlice.actions;
