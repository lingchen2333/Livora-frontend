import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, authApi } from "../../component/service/api";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const response = await authApi.post(`/carts`, {
      productId,
      quantity,
    });
    return response.data;
  }
);

export const getCartByUserId = createAsyncThunk(
  "cart/getCartByUserId",
  async (userId) => {
    const response = await api.get(`/carts/users/${userId}`);
    return response.data.data;
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ cartId, itemId, newQuantity }) => {
    const response = await api.put(`/carts/${cartId}/items/${itemId}`, {
      quantity: newQuantity,
    });
    return { itemId, newQuantity };
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async ({ cartId, productId }) => {
    const response = await api.delete(
      `/carts/${cartId}/items?productId=${productId}`
    );
    return productId;
  }
);

const initialState = {
  id: null,
  totalAmount: 0,
  items: [],
  errorMessage: null,
  successMessage: null,
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.id = null;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        const item = action.payload.data;
        const existingItem = state.items.find(
          (i) => i.product.id === item.product.id
        );
        if (!existingItem) {
          state.items.push(item);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getCartByUserId.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.totalAmount = action.payload.totalAmount;
        state.items = action.payload.items;
        state.errorMessage = null;
        state.isLoading = false;
      })
      .addCase(getCartByUserId.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const { itemId, newQuantity } = action.payload;
        const item = state.items.find((item) => item.id === itemId);
        item.quantity = newQuantity;
        item.totalPrice = item.product.price * newQuantity;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        const productId = action.payload;
        state.items = state.items.filter(
          (item) => item.product.id !== productId
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      });
  },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;
