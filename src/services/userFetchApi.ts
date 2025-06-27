import api from "./api";
import Strings from "../constants/strings";

export const fetchUsers = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  try {
    const { data, status } = await api.get(Strings.API_ALL_USERS, {
      params: { limit, page },
    });
    if (status !== 200) throw new Error(Strings.ERROR_FAILED_FETCH_USERS);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? Strings.ERROR_UNAUTHORIZED
        : error.response?.data?.message || Strings.ERROR_FAILED_FETCH_USERS
    );
  }
};
