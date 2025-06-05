import axios from "axios";
import { logout } from "./authService";

const baseURL = "http://localhost:9090/api/v1";

export const authApi = axios.create({
  baseURL: baseURL,
  withCredentials: true, // for authenticated requests
});

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    return Promise.reject(error);
  }
};

authApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
