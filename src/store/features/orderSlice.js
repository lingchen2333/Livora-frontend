import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (userId) => {
    const response = await api.post(`/users/${userId}/orders`);
    console.log("placeOrder", response.data);
    return response.data;
  }
);

export const getOrdersByUserId = createAsyncThunk(
  "order/getOrdersByUserId",
  async (userId) => {
    const response = await api.get(`/users/${userId}/orders`);
    //console.log("getOrdersByUserId", response.data);
    return response.data;
  }
);

export const createPaymentIntent = createAsyncThunk(
  "order/createPaymentIntent",
  async ({ amount, currency }) => {
    console.log("create payment intent", { amount, currency });
    const response = await api.post(`/payment-intent`, {
      amount,
      currency,
    });
    return response.data;
  }
);

const initialState = {
  orders: [],
  isLoading: true,
  errorMessage: null,
  successMessage: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload.data);
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.errorMessage = action.error.message;
        state.isLoading = false;
      })
      .addCase(getOrdersByUserId.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.isLoading = false;
      });
  },
});

export default orderSlice.reducer;
