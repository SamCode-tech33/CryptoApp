import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CryptoState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchCoins = createAsyncThunk(
  "coins/fetchData",
  async ({
    start,
    limit,
    convert,
  }: {
    start?: number;
    limit?: number;
    convert?: string;
  }) => {
    const { data } = await axios.get(
      `/api/coins?start=${start}&limit=${limit}&convert=${convert}`
    );
    return data.data;
  }
);

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "failed to fetch coins";
      });
  },
});

export const coinsReducer = coinsSlice.reducer;
