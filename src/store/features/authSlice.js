import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/service/api";
import { jwtDecode } from "jwt-decode";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  }
);

const initialState = {
  isAuthenticated: localStorage.getItem("accessToken"),
  token: localStorage.getItem("accessToken") || null,
  roles: JSON.parse(localStorage.getItem("userRoles")) || [],
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const decodedToken = jwtDecode(action.payload.accessToken);
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.roles = decodedToken.roles;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("userRoles", JSON.stringify(decodedToken.roles));
        localStorage.setItem("userId", decodedToken.id);
      })
      .addCase(login.rejected, (state) => {
        state.errorMessage = "Invalid credentials";
      });
  },
});

export default authSlice.reducer;
