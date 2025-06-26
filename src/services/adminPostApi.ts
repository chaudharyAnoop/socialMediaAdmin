import api from "./api";

interface Post {
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

interface FetchPostsResponse {
  posts: Post[];
  total: number;
}

export const fetchAllPosts = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const { data, status } = await api.get<FetchPostsResponse>(
      "/admin/all-posts",
      {
        params: { page, limit },
      }
    );
    if (status !== 200 || !Array.isArray(data?.posts)) {
      throw new Error("Invalid posts data: Expected array of posts");
    }
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized: Invalid or missing token"
        : error.response?.data?.message ||
          `Failed to fetch posts: ${error.message}`
    );
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { data, status } = await api.delete(`/admin/posts/${postId}`);
    if (status !== 200) {
      throw new Error("Failed to delete post");
    }
    return { postId, deleted: true };
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized: Invalid or missing token"
        : error.response?.data?.message ||
          `Failed to delete post: ${error.message}`
    );
  }
};
