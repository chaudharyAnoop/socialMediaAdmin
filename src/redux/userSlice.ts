// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// interface User {
//   id: string;
//   email: string;
//   username: string;
//   fullName?: string;
//   bio: string;
//   accountType: string;
//   profilePicture: string;
//   followersCount: number;
//   followingCount: number;
//   followers?: string[];
//   following?: string[];
//   isBanned: boolean;
//   banReason: string;
// }

// interface UsersState {
//   users: User[];
//   totalCount: number;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: UsersState = {
//   users: [],
//   totalCount: 0,
//   status: "idle",
//   error: null,
// };

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRmYmRlN2U4Y2NhNGJlNGM4ZDI3MDkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZGV2aWNlSWQiOiJUZXN0SWQiLCJpcEFkZHJlc3MiOiI6OmZmZmY6MTcyLjUwLjUuMTE0IiwidXNlckFnZW50IjoiZ2giLCJpYXQiOjE3NTA2NTQ2MjgsImV4cCI6MTc1MDY1NzYyOCwic3ViIjoiNjg0ZmJkZTdlOGNjYTRiZTRjOGQyNzA5In0.mKt27jZt_uvknZrA6dhG5dcIRAqoMByjb3LF-Itw2QA";

// export const fetchUsers = createAsyncThunk(
//   "users/fetchUsers",
//   async ({ limit = 10, page = 1 }: { limit?: number; page?: number }) => {
//     const response = await axios.get(
//       "http://172.50.3.106:3002/admin/AllUsers",
//       {
//         params: { limit, page },
//         headers: {
//           Accept: "*/*",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   }
// );

// const usersSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.users = action.payload.users;
//         state.totalCount = action.payload.totalCount;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Failed to fetch users";
//       });
//   },
// });

// export default usersSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRmYmRlN2U4Y2NhNGJlNGM4ZDI3MDkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZGV2aWNlSWQiOiJUZXN0SWQiLCJpcEFkZHJlc3MiOiI6OmZmZmY6MTcyLjUwLjUuMTE0IiwidXNlckFnZW50IjoiZ2giLCJpYXQiOjE3NTA2NTQ2MjgsImV4cCI6MTc1MDY1NzYyOCwic3ViIjoiNjg0ZmJkZTdlOGNjYTRiZTRjOGQyNzA5In0.mKt27jZt_uvknZrA6dhG5dcIRAqoMByjb3LF-Itw2QA";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    { limit = 10, page = 1 }: { limit?: number; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        "http://172.50.3.106:3002/admin/AllUsers",
        {
          params: { limit, page },
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch users");
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
        `http://172.50.3.106:3002/admin/ban/${userId}`,
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
      return rejectWithValue(error.message || "Failed to ban user");
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
      });
  },
});

export const { clearBanError } = usersSlice.actions;
export default usersSlice.reducer;
