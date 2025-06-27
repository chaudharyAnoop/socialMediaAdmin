import { Status } from "../constants/enums";

export interface FollowState {
  followers: { totalCount: number };
  following: { totalCount: number };
  loading: boolean;
  error: string | null;
  status: Status;
}

export interface FetchFollowParams {
  userId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio: string;
  accountType: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  isBanned: boolean;
  banReason: string;
}

export interface UserSearchState {
  user: User | null;
  status: Status;
  error: string | null;
}
