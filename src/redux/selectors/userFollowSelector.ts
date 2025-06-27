import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectUserFollowState = (state: RootState) => state.follow;

export const selectFollowers = createSelector(
  [selectUserFollowState],
  (followState) => followState.followers
);

export const selectFollowing = createSelector(
  [selectUserFollowState],
  (followState) => followState.following
);

export const selectUserFollowLoading = createSelector(
  [selectUserFollowState],
  (followState) => followState.loading
);

export const selectUserFollowError = createSelector(
  [selectUserFollowState],
  (followState) => followState.error
);

export const selectUserFollowStatus = createSelector(
  [selectUserFollowState],
  (followState) => followState.status
);
