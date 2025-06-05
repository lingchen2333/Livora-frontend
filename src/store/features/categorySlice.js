import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async () => {
    const response = await api.get("/categories");
    return response.data;
  }
);

const initialState = {
  categories: [], //categoryName
  errorMessage: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data.map((category) => category.name);
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      });
  },
});

export default categorySlice.reducer;
export const { addCategory } = categorySlice.actions;
