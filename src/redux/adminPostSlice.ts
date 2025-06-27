import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import token from "./tokens";
import type { AdminPostsState, Post } from "../Interfaces/adminPost";

import { Status } from "../constants/enums";

const initialState: AdminPostsState = {
  posts: [],
  status: Status.Idle,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
};

export const fetchAllPosts = createAsyncThunk<
  Post[],
  void,
  { rejectValue: string }
>("adminPosts/fetchAllPosts", async (_, { rejectWithValue }) => {
  try {
    const headers = token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        }
      : {};
    const response = await axios.get<Post[]>(
      "http://172.50.3.106:3002/admin/all-posts",
      { headers }
    );
    const posts = response.data;
    if (!Array.isArray(posts)) {
      return rejectWithValue("Invalid posts data received");
    }
    return posts;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

const adminPostsSlice = createSlice({
  name: "adminPosts",
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.posts = [];
      state.status = Status.Idle;
      state.error = null;
      state.page = 1;
      state.total = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload > 0 ? action.payload : 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(
        fetchAllPosts.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.status = Status.Succeeded;
          state.posts = action.payload || [];
          state.total = action.payload.length;
        }
      )
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.payload || "Failed to fetch posts";
      });
  },
});

export const { resetPosts, setPage } = adminPostsSlice.actions;
export default adminPostsSlice.reducer;
