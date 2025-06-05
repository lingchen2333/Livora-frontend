import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (userId) => {
    const response = await api.post(`/orders/users/${userId}`);
    console.log("placeOrder", response.data);
    return response.data;
  }
);

export const getOrdersByUserId = createAsyncThunk(
  "order/getOrdersByUserId",
  async (userId) => {
    const response = await api.get(`/orders/users/${userId}`);
    //console.log("getOrdersByUserId", response.data);
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
      .addCase(getOrdersByUserId.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.isLoading = false;
      });
  },
});

export default orderSlice.reducer;
