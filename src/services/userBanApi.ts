import api from "./api";
import Strings from "../constants/strings";

export const banUser = async (userId: string, reason: string) => {
  try {
    const { data, status } = await api.post(
      `${Strings.API_BAN_USER}${userId}`,
      { reason }
    );
    if (status !== 201) throw new Error(Strings.ERROR_FAILED_BAN_USER);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? Strings.ERROR_UNAUTHORIZED
        : error.response?.data?.message || Strings.ERROR_FAILED_BAN_USER
    );
  }
};

export const unbanUser = async (userId: string) => {
  try {
    const { data, status } = await api.post(
      `${Strings.API_UNBAN_USER}${userId}`,
      {}
    );
    if (status !== 201) throw new Error(Strings.ERROR_FAILED_UNBAN_USER);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.status === 401
        ? Strings.ERROR_UNAUTHORIZED
        : error.response?.data?.message || Strings.ERROR_FAILED_UNBAN_USER
    );
  }
};
