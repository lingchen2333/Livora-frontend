import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, authApi } from "../../component/service/api";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async () => {
    const response = await api.get("/products");
    console.log(response);
    return response.data.data;
  }
);

export const getDistinctProductBrands = createAsyncThunk(
  "product/getDistinctProductBrands",
  async () => {
    const response = await api.get("/products/distinct/brands");
    return response.data.data;
  }
);

export const getFirstProductPerDistinctName = createAsyncThunk(
  "product/getFirstProductPerDistinctName",
  async () => {
    const response = await api.get("/products/distinct");
    console.log(response);
    return response.data.data;
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data;
  }
);

export const addNewProduct = createAsyncThunk(
  "product/addNewProduct",
  async (product) => {
    console.log("request from addProduct: ", product);
    const response = await authApi.post(`/products`, product);
    console.log("response.data from the slice", response.data);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product) => {
    const response = await authApi.put(`/products/${product.id}`, product);
    return response.data;
  }
);

export const deleteProductById = createAsyncThunk(
  "product/deleteProductById",
  async (productId) => {
    const response = await authApi.delete(`/products/${productId}`);
    return response.data;
  }
);

const initialState = {
  products: [],
  product: null,
  productsWithDistinctName: [],
  brands: [],
  selectedBrands: [],
  errorMessage: null,
  isLoading: true,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    filteredByBrand: (state, action) => {
      const { brand, isChecked } = action.payload;
      if (isChecked) {
        state.selectedBrands.push(brand);
      } else {
        state.selectedBrands = state.selectedBrands.filter((b) => b !== brand);
      }
    },

    setSelectedBrands: (state, action) => {
      state.selectedBrands = action.payload;
    },

    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getDistinctProductBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.isLoading = false;
      })
      .addCase(getFirstProductPerDistinctName.fulfilled, (state, action) => {
        state.productsWithDistinctName = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.isLoading = false;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.product = action.payload.data;
        state.products.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload.data;
        state.isLoading = false;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload.data
        );
        state.isLoading = false;
      });
  },
});

export default productSlice.reducer;
export const { filteredByBrand, setSelectedBrands, addBrand } =
  productSlice.actions;
