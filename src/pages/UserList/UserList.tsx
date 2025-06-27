import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../redux/store";
import {
  banUser,
  unbanUser,
  clearBanError,
  fetchUsers,
} from "../../redux/userSlice";

import {
  selectUsers,
  selectUsersTotalCount,
  selectUsersStatus,
  selectUsersError,
  selectUsersBanStatus,
  selectUsersBanError,
} from "../../redux/selectors/userSelector";

import styles from "./userlist.module.css";
import type { UserState } from "../../Interfaces/user";
import Strings from "../../constants/strings";

type State = {
  page: number;
  limit: number;
  banPrompt: { userId: string; username: string } | null;
  banReason: string;
};

type Action =
  | { type: "SET_PAGE"; payload: number }
  | {
      type: "SET_BAN_PROMPT";
      payload: { userId: string; username: string } | null;
    }
  | { type: "SET_BAN_REASON"; payload: string }
  | { type: "RESET_BAN_PROMPT" };

const initialState: State = {
  page: 1,
  limit: 10,
  banPrompt: null,
  banReason: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_BAN_PROMPT":
      return { ...state, banPrompt: action.payload, banReason: "" };
    case "SET_BAN_REASON":
      return { ...state, banReason: action.payload };
    case "RESET_BAN_PROMPT":
      return { ...state, banPrompt: null, banReason: "" };
    default:
      return state;
  }
}

const UsersList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, totalCount, status, error, banStatus, banError } = useSelector(
    (state: RootState) => ({
      users: selectUsers(state),
      totalCount: selectUsersTotalCount(state),
      status: selectUsersStatus(state),
      error: selectUsersError(state),
      banStatus: selectUsersBanStatus(state),
      banError: selectUsersBanError(state),
    })
  );

  const [state, localDispatch] = useReducer(reducer, initialState);
  const { page, limit, banPrompt, banReason } = state;

  useEffect(() => {
    dispatch(fetchUsers({ limit, page }));
  }, [dispatch, limit, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / limit)) {
      localDispatch({ type: "SET_PAGE", payload: newPage });
    }
  };

  const handleBanClick = (userId: string, username: string) => {
    localDispatch({ type: "SET_BAN_PROMPT", payload: { userId, username } });
  };

  const handleUnbanClick = (userId: string) => {
    dispatch(unbanUser(userId));
  };

  const handleBanConfirm = () => {
    if (banPrompt && banReason.trim()) {
      dispatch(banUser({ userId: banPrompt.userId, reason: banReason.trim() }));
      localDispatch({ type: "RESET_BAN_PROMPT" });
    }
  };

  const handleBanCancel = () => {
    if (banPrompt) {
      dispatch(clearBanError(banPrompt.userId));
      localDispatch({ type: "RESET_BAN_PROMPT" });
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          {Strings.USERS_LIST_TITLE} ({totalCount})
        </h3>
      </div>

      {status === "loading" && (
        <p className={styles.loading}>{Strings.LOADING_USERS}</p>
      )}
      {status === "failed" && (
        <p className={styles.error}>
          {Strings.ERROR_PREFIX}
          {error}
        </p>
      )}

      {status === "succeeded" && users.length === 0 && (
        <p className={styles.noData}>{Strings.NO_USERS_FOUND}</p>
      )}

      {status === "succeeded" && users.length > 0 && (
        <>
          <div className={styles.userGrid}>
            {users.map((user: UserState) => (
              <div key={user.id} className={styles.userCard}>
                <h3>{user.username}</h3>
                <p>
                  {Strings.EMAIL_LABEL} {user.email}
                </p>
                <p>
                  {Strings.NAME_LABEL} {user.fullName || "N/A"}
                </p>
                <p>
                  {Strings.FOLLOWERS_LABEL} {user.followersCount}
                </p>
                <p>
                  {Strings.FOLLOWING_LABEL} {user.followingCount}
                </p>
                <p>
                  {Strings.STATUS_LABEL}{" "}
                  {user.isBanned
                    ? Strings.STATUS_BANNED
                    : Strings.STATUS_ACTIVE}
                </p>
                {user.isBanned && (
                  <p>
                    {Strings.REASON_LABEL} {user.banReason || "N/A"}
                  </p>
                )}
                <div className={styles.userActions}>
                  {!user.isBanned ? (
                    <button
                      className={styles.banButton}
                      onClick={() => handleBanClick(user.id, user.username)}
                      disabled={banStatus[user.id] === "loading"}
                    >
                      {banStatus[user.id] === "loading"
                        ? Strings.BANNING
                        : Strings.BAN_USER}
                    </button>
                  ) : (
                    <button
                      className={styles.unbanButton}
                      onClick={() => handleUnbanClick(user.id)}
                      disabled={banStatus[user.id] === "loading"}
                    >
                      {banStatus[user.id] === "loading"
                        ? Strings.UNBANNING
                        : Strings.UNBAN_USER}
                    </button>
                  )}
                </div>
                {banError[user.id] && (
                  <p className={styles.error}>{banError[user.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className={styles.pageButton}
            >
              {Strings.PREVIOUS}
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => handlePageChange(page + 1)}
              className={styles.pageButton}
            >
              {Strings.NEXT}
            </button>
          </div>
        </>
      )}

      {banPrompt && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>
              {Strings.BAN_USER_PROMPT}
              {banPrompt.username}
            </h2>
            <label htmlFor="banReason">{Strings.REASON_FOR_BAN}</label>
            <textarea
              id="banReason"
              value={banReason}
              onChange={(e) =>
                localDispatch({
                  type: "SET_BAN_REASON",
                  payload: e.target.value,
                })
              }
              className={styles.banReasonInput}
              placeholder={Strings.BAN_REASON_PLACEHOLDER}
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleBanConfirm}
                className={styles.confirmButton}
                disabled={
                  !banReason.trim() || banStatus[banPrompt.userId] === "loading"
                }
              >
                {Strings.CONFIRM}
              </button>
              <button onClick={handleBanCancel} className={styles.cancelButton}>
                {Strings.CANCEL}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
