import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectUsersState = (state: RootState) => state.users;

export const selectUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.users
);

export const selectUsersTotalCount = createSelector(
  [selectUsersState],
  (usersState) => usersState.totalCount
);

export const selectUsersStatus = createSelector(
  [selectUsersState],
  (usersState) => usersState.status
);

export const selectUsersError = createSelector(
  [selectUsersState],
  (usersState) => usersState.error
);

export const selectUsersBanStatus = createSelector(
  [selectUsersState],
  (usersState) => usersState.banStatus
);

export const selectUsersBanError = createSelector(
  [selectUsersState],
  (usersState) => usersState.banError
);
