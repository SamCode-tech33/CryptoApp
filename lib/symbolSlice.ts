import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sym: "BTC",
};
const symbolSlice = createSlice({
  name: "symbol",
  initialState,
  reducers: {
    changeGraph: (state, newState) => {
      state.sym = newState.payload;
    },
  },
});

export const symbolReducer = symbolSlice.reducer;
export const { changeGraph } = symbolSlice.actions;
