import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

import type { UsersState } from "../Interfaces/user";

import { Status, BanStatus } from "../constants/enums";

const initialState: UsersState = {
  users: [],
  totalCount: 0,
  status: Status.Idle,
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
      const { data, status } = await api.get("/admin/all-users", {
        params: { limit, page },
      });
      return status === 200 ? data : rejectWithValue("Failed to fetch users");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "Failed to fetch users"
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
      const { data, status } = await api.post(`/admin/ban/${userId}`, {
        reason,
      });
      return status === 201 ? data : rejectWithValue("Failed to ban user");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "Failed to ban user"
      );
    }
  }
);

export const unbanUser = createAsyncThunk(
  "users/unbanUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, status } = await api.post(
        `/admin/unban-user/${userId}`,
        {}
      );
      return status === 201 ? data : rejectWithValue("Failed to unban user");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "Failed to unban user"
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
      state.banStatus[action.payload] = BanStatus.Idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.users = action.payload.users || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = (action.payload as string) || "Failed to fetch users";
      })
      .addCase(banUser.pending, (state, action) => {
        state.banStatus[action.meta.arg.userId] = BanStatus.Loading;
        state.banError[action.meta.arg.userId] = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.banStatus[action.meta.arg.userId] = BanStatus.Idle;
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
        state.banStatus[action.meta.arg.userId] = BanStatus.Failed;
        state.banError[action.meta.arg.userId] =
          (action.payload as string) || "Failed to ban user";
      })
      .addCase(unbanUser.pending, (state, action) => {
        state.banStatus[action.meta.arg] = BanStatus.Loading;
        state.banError[action.meta.arg] = null;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.banStatus[action.meta.arg] = BanStatus.Idle;
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
        state.banStatus[action.meta.arg] = BanStatus.Failed;
        state.banError[action.meta.arg] =
          (action.payload as string) || "Failed to unban user";
      });
  },
});

export const { clearBanError } = usersSlice.actions;
export default usersSlice.reducer;
