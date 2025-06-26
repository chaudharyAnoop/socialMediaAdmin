import api from "./api";

export const fetchFollowers = async (userId: string) => {
  try {
    const { data, status } = await api.get(`/admin/followers/${userId}`);
    if (status !== 200) throw new Error("User not found");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized"
        : error.response?.data?.message || "User not found"
    );
  }
};

export const fetchFollowing = async (userId: string) => {
  try {
    const { data, status } = await api.get(`/admin/following/${userId}`);
    if (status !== 200) throw new Error("User not found");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized"
        : error.response?.data?.message || "User not found"
    );
  }
};
