import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../services/api";

import type { User, UserSearchState } from "../Interfaces/userFollow";

const initialState: UserSearchState = {
  user: null,
  status: "idle",
  error: null,
};

export const findUserByEmail = createAsyncThunk(
  "userSearch/findUserByEmail",
  async (email: string, { rejectWithValue }) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return rejectWithValue("Valid email is required");
    }
    try {
      const { data, status } = await api.get(
        `/admin/find-by-email?email=${encodeURIComponent(email)}`
      );
      return status === 200 && data?.id && data.email
        ? data
        : rejectWithValue("Invalid user data received");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const userSearchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    resetUserSearch: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findUserByEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        findUserByEmail.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(findUserByEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetUserSearch } = userSearchSlice.actions;
export default userSearchSlice.reducer;
