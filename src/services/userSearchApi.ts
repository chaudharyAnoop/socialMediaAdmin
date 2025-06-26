import api from "./api";

export const findUserByEmail = async (email: string) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Valid email is required");
  }
  try {
    const { data, status } = await api.get(
      `/admin/find-by-email?email=${encodeURIComponent(email)}`
    );
    if (status !== 200 || !data?.id || !data.email) {
      throw new Error("Invalid user data received");
    }
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized"
        : error.response?.data?.message || "Failed to fetch user"
    );
  }
};
