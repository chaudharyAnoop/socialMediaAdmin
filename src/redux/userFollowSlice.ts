import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

import type { FetchFollowParams, FollowState } from "../Interfaces/userFollow";

import { Status } from "../constants/enums";

const initialState: FollowState = {
  followers: { totalCount: 0 },
  following: { totalCount: 0 },
  loading: false,
  error: null,
  status: Status.Idle,
};

export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async ({ userId }: FetchFollowParams, { rejectWithValue }) => {
    try {
      const { data, status } = await api.get(`/admin/followers/${userId}`);
      return status === 200 ? data : rejectWithValue("User not found");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "User not found"
      );
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async ({ userId }: FetchFollowParams, { rejectWithValue }) => {
    try {
      const { data, status } = await api.get(`/admin/following/${userId}`);
      return status === 200 ? data : rejectWithValue("User not found");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "User not found"
      );
    }
  }
);

const userFollowSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.status = Status.Failed;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.status = Status.Failed;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userFollowSlice.actions;
export default userFollowSlice.reducer;
