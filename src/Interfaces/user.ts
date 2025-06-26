export interface User {
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

export interface UsersState {
  users: User[];
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  banStatus: { [key: string]: "idle" | "loading" | "failed" };
  error: string | null;
  banError: { [key: string]: string | null };
}

export interface UserState {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  bio: string;
  accountType: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  isBanned: boolean;
  banReason: string;
}
