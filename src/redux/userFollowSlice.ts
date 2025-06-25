import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import token from "./tokens";

const BASE_URL = "http://172.50.3.106:3002";

interface FollowState {
  followers: { totalCount: number };
  following: { totalCount: number };
  loading: boolean;
  error: string | null;
}

interface FetchFollowParams {
  userId: string;
  token: string;
}

const initialState: FollowState = {
  followers: { totalCount: 0 },
  following: { totalCount: 0 },
  loading: false,
  error: null,
};

export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async ({ userId }: FetchFollowParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/followers/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401 ? "Unauthorized" : "User not found"
      );
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async ({ userId }: FetchFollowParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/following/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401 ? "Unauthorized" : "User not found"
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userFollowSlice.actions;
export default userFollowSlice.reducer;
