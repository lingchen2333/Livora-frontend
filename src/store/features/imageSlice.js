import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";

export const uploadImages = createAsyncThunk(
  "image/uploadImages",
  async ({ files, productId }) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await api.post(`/products/${productId}/images`, formData);
    return response.data;
  }
);

export const updateImageById = createAsyncThunk(
  "image/updateImageById",
  async ({ imageId, file }) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put(`/images/${imageId}`, formData);
    return response.data;
  }
);

export const deleteImageById = createAsyncThunk(
  "image/deleteImageById",
  async ({ imageId }) => {
    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  }
);

const initialState = {
  uploadedImages: [],
};

const imageSlice = createSlice({
  name: "image",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.uploadedImages = [
          ...state.uploadedImages,
          ...action.payload.data,
        ];
      })
      .addCase(updateImageById.fulfilled, (state, action) => {
        state.uploadedImages = [...state.uploadedImages, action.payload.data];
      });
  },
});

export default imageSlice.reducer;
