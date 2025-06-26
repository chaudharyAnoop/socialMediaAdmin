import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectAdminPosts = (state: RootState) => state.adminPosts;
export const selectAdminPostsList = (state: RootState) =>
  state.adminPosts.posts;
export const selectAdminPostsStatus = (state: RootState) =>
  state.adminPosts.status;
export const selectAdminPostsError = (state: RootState) =>
  state.adminPosts.error;
export const selectAdminPostsPage = (state: RootState) => state.adminPosts.page;
export const selectAdminPostsLimit = (state: RootState) =>
  state.adminPosts.limit;
export const selectAdminPostsTotal = (state: RootState) =>
  state.adminPosts.total;

export const selectAdminPostsPaginated = createSelector(
  [selectAdminPosts],
  (adminPosts) => ({
    posts: adminPosts.posts,
    page: adminPosts.page,
    limit: adminPosts.limit,
    total: adminPosts.total,
  })
);

export const selectAdminPostsIfSucceeded = createSelector(
  [selectAdminPosts],
  (adminPosts) => (adminPosts.status === "succeeded" ? adminPosts.posts : [])
);
