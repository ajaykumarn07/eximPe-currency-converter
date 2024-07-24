import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY; // Make sure to add your new API
// console.log(`${import.meta.env.VITE_API_KEY}`);

// const API_KEY = "59a2e714dd724b7aab3a6441c8b6e2ef";
const BASE_URL = "https://openexchangerates.org/api/";

//Fetch exchange rates
export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async ({ base, date }) => {
    const url = date
      ? `${BASE_URL}historical/${date}.json`
      : `${BASE_URL}latest.json`;
    const response = await axios.get(`${url}?app_id=${API_KEY}&base=${base}`);
    return response.data.rates;
  }
);

// Fetch available currencies
export const fetchCurrencies = createAsyncThunk(
  "currency/fetchCurrencies",
  async () => {
    const response = await axios.get(`${BASE_URL}currencies.json`);
    return response.data;
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    rates: {},
    currencies: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCurrencies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currencies = Object.keys(action.payload);
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default currencySlice.reducer;
