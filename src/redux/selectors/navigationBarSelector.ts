import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectNavigationBarState = (state: RootState) => state.sidebar;

export const selectIsNavigationBarVisible = createSelector(
  [selectNavigationBarState],
  (navigationBarState) => navigationBarState.isVisible
);
