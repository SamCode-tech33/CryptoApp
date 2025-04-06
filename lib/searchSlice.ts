import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
};
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    changeSearch: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const searchReducer = searchSlice.reducer;
export const { changeSearch } = searchSlice.actions;
