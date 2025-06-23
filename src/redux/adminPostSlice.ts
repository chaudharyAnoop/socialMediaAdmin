import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import token from "./tokens";

interface Post {
  _id: string;
  UserId: string;
  content: string;
  media: string[];
  visibility: string;
  deleted: boolean;
  moderated: boolean;
  keywords?: string[];
  isReported: boolean;
  reportReason: string;
}

interface AdminPostsState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  limit: number;
  total: number;
}

const initialState: AdminPostsState = {
  posts: [],
  status: "idle",
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
      state.status = "idle";
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllPosts.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.status = "succeeded";
          state.posts = action.payload || [];
          state.total = action.payload.length;
        }
      )
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch posts";
      });
  },
});

export const { resetPosts, setPage } = adminPostsSlice.actions;
export default adminPostsSlice.reducer;
