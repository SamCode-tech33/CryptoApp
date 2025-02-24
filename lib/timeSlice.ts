import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  time: "minutes",
  aggre: 5,
  limit: 288
};
const timeSlice = createSlice({
  name: "timeperiod",
  initialState,
  reducers: {
    changeTimePeriod: (state, newState) => {
      state.time = newState.payload.time;
      state.aggre = newState.payload.aggre;
      state.limit = newState.payload.limit;
    },
  },
});

export const timeReducer = timeSlice.reducer;
export const { changeTimePeriod } = timeSlice.actions;
