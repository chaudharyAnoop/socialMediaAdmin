import api from "./api";

export const fetchUsers = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  try {
    const { data, status } = await api.get("/admin/all-users", {
      params: { limit, page },
    });
    if (status !== 200) throw new Error("Failed to fetch users");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized"
        : error.response?.data?.message || "Failed to fetch users"
    );
  }
};

export const banUser = async (userId: string, reason: string) => {
  try {
    const { data, status } = await api.post(`/admin/ban/${userId}`, { reason });
    if (status !== 201) throw new Error("Failed to ban user");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized"
        : error.response?.data?.message || "Failed to ban user"
    );
  }
};

export const unbanUser = async (userId: string) => {
  try {
    const { data, status } = await api.post(`/admin/unban-user/${userId}`, {});
    if (status !== 201) throw new Error("Failed to unban user");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized"
        : error.response?.data?.message || "Failed to unban user"
    );
  }
};
