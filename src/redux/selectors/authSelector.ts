import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectAuth = (state: RootState) => state.auth;

export const selectAccessToken = createSelector(
  [selectAuth],
  (auth) => auth.accessToken
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

export const selectAuthStatus = createSelector(
  [selectAuth],
  (auth) => auth.status
);
