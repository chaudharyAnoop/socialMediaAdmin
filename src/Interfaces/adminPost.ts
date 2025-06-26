export interface Post {
  _id: string;
  UserId: string;
  content: string;
  media: string[];
  visibility: string;
  deleted: boolean;
  moderated: boolean;
  keywords?: string[];
  isReported: boolean;
  reportReason: string;
}

export interface AdminPostsState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  limit: number;
  total: number;
}
