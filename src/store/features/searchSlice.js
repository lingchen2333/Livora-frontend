import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";

export const searchByImage = createAsyncThunk(
  "search/searchByImage",
  async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.post("/products/search-by-image", formData);
    console.log("searchByImage", response.data);
    return response.data;
  }
);

const initialState = {
  searchQuery: "",
  selectedCategory: "all",
  imageSearchResults: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setImageSearchResult: (state, action) => {
      state.imageSearchResults = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "all";
      state.imageSearchResults = [];
    },
    setInitialSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchByImage.fulfilled, (state, action) => {
      state.imageSearchResults = action.payload.data;
    });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setImageSearchResult,
  clearFilters,
  setInitialSearchQuery,
} = searchSlice.actions;
export default searchSlice.reducer;
