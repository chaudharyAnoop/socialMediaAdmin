import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectUserSearchState = (state: RootState) => state.userSearch;

export const selectUserSearchUser = createSelector(
  [selectUserSearchState],
  (userSearchState) => userSearchState.user
);

export const selectUserSearchStatus = createSelector(
  [selectUserSearchState],
  (userSearchState) => userSearchState.status
);

export const selectUserSearchError = createSelector(
  [selectUserSearchState],
  (userSearchState) => userSearchState.error
);
