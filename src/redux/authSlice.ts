import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://172.50.3.106:3002";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

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
      const response = await axios.post(
        `${BASE_URL}/admin/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "postman-token": "dsa",
            Accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Unauthorized: Invalid email or password");
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
