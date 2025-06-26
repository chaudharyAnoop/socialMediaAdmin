import api from "./api";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data, status } = await api.post<LoginResponse>("/admin/login", {
      email,
      password,
    });
    if (status !== 201 || !data.accessToken) {
      throw new Error("Invalid login response");
    }
    localStorage.setItem("loginToken", data.accessToken);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? "Unauthorized: Invalid email or password"
        : error.response?.data?.message || `Login failed: ${error.message}`
    );
  }
};
