import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import token from "./tokens";

const BASE_URL = "http://172.50.3.106:3002";

interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  bio: string;
  accountType: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  followers?: string[];
  following?: string[];
  isBanned: boolean;
  banReason: string;
}

interface UsersState {
  users: User[];
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  banStatus: { [key: string]: "idle" | "loading" | "failed" };
  error: string | null;
  banError: { [key: string]: string | null };
}

const initialState: UsersState = {
  users: [],
  totalCount: 0,
  status: "idle",
  banStatus: {},
  error: null,
  banError: {},
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    { limit = 10, page = 1 }: { limit?: number; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/all-users`, {
        params: { limit, page },
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Invalid or missing token");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const banUser = createAsyncThunk(
  "users/banUser",
  async (
    { userId, reason }: { userId: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/ban/${userId}`,
        { reason },
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 201) {
        throw new Error("Failed to ban user");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Invalid or missing token");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to ban user"
      );
    }
  }
);

export const unbanUser = createAsyncThunk(
  "users/unbanUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/unban-user/${userId}`,
        {},
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 201) {
        throw new Error("Failed to unban user");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Invalid or missing token");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to unban user"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearBanError: (state, action: { payload: string }) => {
      state.banError[action.payload] = null;
      state.banStatus[action.payload] = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch users";
      })
      .addCase(banUser.pending, (state, action) => {
        state.banStatus[action.meta.arg.userId] = "loading";
        state.banError[action.meta.arg.userId] = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.banStatus[action.meta.arg.userId] = "idle";
        const bannedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === bannedUser.id
        );
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            isBanned: bannedUser.isBanned,
            banReason: bannedUser.banReason,
          };
        }
      })
      .addCase(banUser.rejected, (state, action) => {
        state.banStatus[action.meta.arg.userId] = "failed";
        state.banError[action.meta.arg.userId] =
          (action.payload as string) || "Failed to ban user";
      })
      .addCase(unbanUser.pending, (state, action) => {
        state.banStatus[action.meta.arg] = "loading";
        state.banError[action.meta.arg] = null;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.banStatus[action.meta.arg] = "idle";
        const unbannedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === unbannedUser.id
        );
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            isBanned: unbannedUser.isBanned,
            banReason: unbannedUser.banReason,
          };
        }
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.banStatus[action.meta.arg] = "failed";
        state.banError[action.meta.arg] =
          (action.payload as string) || "Failed to unban user";
      });
  },
});

export const { clearBanError } = usersSlice.actions;
export default usersSlice.reducer;
