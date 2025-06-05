import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";
import axios from "axios";

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId) => {
    const response = await api.get(`/users/${userId}`);
    console.log("getUserById", response.data);
    return response.data;
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async ({ user, addresses }) => {
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      addressList: addresses,
    };
    const response = await api.post(`/users`, payload);
    console.log("addUser", response.data);
    return response.data;
  }
);

export const getAllCountries = createAsyncThunk(
  "user/getAllCountries",
  async () => {
    const response = await axios.get(
      `https://restcountries.com/v3.1/all?fields=name`
    );
    // console.log(response);
    const countryNames = response.data.map((country) => country.name.common);
    countryNames.sort((a, b) => a.localeCompare(b));
    return countryNames;
  }
);

export const getAllAddresses = createAsyncThunk(
  "user/getAllAddresses",
  async (userId) => {
    const response = await api.get(`/users/${userId}/addresses`);
    return response.data;
  }
);

export const addAddress = createAsyncThunk(
  "user/addAddress",
  async ({ userId, address }) => {
    const response = await api.post(`/users/${userId}/addresses`, { address });
    return response.data;
  }
);

export const deleteAddressById = createAsyncThunk(
  "user/deleteAddressById",
  async (addressId) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  }
);

export const updateAddressById = createAsyncThunk(
  "user/updateAddressById",
  async ({ addressId, address }) => {
    const response = await api.put(`/addresses/${addressId}`, { address });
    return response.data;
  }
);

const initialState = {
  user: null,
  isLoading: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserAddresses: (state, action) => {
      state.user.addressList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoading = false;
      })
      .addCase(addUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, setUserAddresses } = userSlice.actions;
export default userSlice.reducer;
