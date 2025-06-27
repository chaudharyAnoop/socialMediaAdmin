export const Status = {
  Idle: "idle",
  Loading: "loading",
  Succeeded: "succeeded",
  Failed: "failed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const BanStatus = {
  Idle: "idle",
  Loading: "loading",
  Failed: "failed",
} as const;

export type BanStatus = (typeof BanStatus)[keyof typeof BanStatus];

export const AuthStatus = {
  Idle: "idle",
  Loading: "loading",
  Succeeded: "succeeded",
  Failed: "failed",
} as const;

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];

// Add other enums as needed for roles, user states, etc.
