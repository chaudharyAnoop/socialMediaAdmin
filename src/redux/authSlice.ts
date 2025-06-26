import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

import type {
  AuthState,
  LoginCredentials,
  LoginResponse,
} from "../Interfaces/adminAuth";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data, status } = await api.post<LoginResponse>("/admin/login", {
        email,
        password,
      });
      if (status !== 201 || !data.accessToken) {
        throw new Error("Invalid login response");
      }
      localStorage.setItem("loginToken", data.accessToken);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized: Invalid email or password"
          : error.response?.data?.message || `Login failed: ${error.message}`
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      localStorage.removeItem("loginToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
