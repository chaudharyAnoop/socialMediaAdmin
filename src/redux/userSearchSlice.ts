import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import token from "./tokens";

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio: string;
  accountType: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  isBanned: boolean;
  banReason: string;
}

interface UserSearchState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserSearchState = {
  user: null,
  status: "idle",
  error: null,
};

export const findUserByEmail = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("userSearch/findUserByEmail", async (email, { rejectWithValue }) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return rejectWithValue("Valid email is required");
  }
  try {
    const headers = token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        }
      : {};
    const response = await axios.get<{
      id: string;
      email: string;
      username: string;
      fullName: string;
      bio: string;
      accountType: string;
      profilePicture: string;
      followersCount: number;
      followingCount: number;
      followers: string[];
      following: string[];
      isBanned: boolean;
      banReason: string;
    }>(
      `http://172.50.3.106:3002/admin/find-by-email?email=${encodeURIComponent(
        email
      )}`,
      { headers }
    );
    const user = response.data;
    if (!user?.id || !user.email) {
      return rejectWithValue("Invalid user data received");
    }
    return user as User;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

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
        state.error = action.payload || "Failed to fetch user";
      });
  },
});

export const { resetUserSearch } = userSearchSlice.actions;
export default userSearchSlice.reducer;
