import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./navigationBarSlice";
import userReducer from "./userSlice";
import userSearchReducer from "./userSearchSlice";
import adminPostsReducer from "./adminPostSlice";
import userFollowReducer from "./userFollowSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    users: userReducer,
    userSearch: userSearchReducer,
    adminPosts: adminPostsReducer,
    follow: userFollowReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
