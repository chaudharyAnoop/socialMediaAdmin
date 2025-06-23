import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./userlist.module.css";
import type { AppDispatch, RootState } from "../../redux/store";
import { banUser, clearBanError, fetchUsers } from "../../redux/userSlice";

interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  bio: string;
  accountType: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  isBanned: boolean;
  banReason: string;
}

const UsersList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, totalCount, status, error, banStatus, banError } = useSelector(
    (state: RootState) => state.users
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [banPrompt, setBanPrompt] = useState<{
    userId: string;
    username: string;
  } | null>(null);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ limit, page }));
  }, [dispatch, limit, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / limit)) {
      setPage(newPage);
    }
  };

  const handleBanClick = (userId: string, username: string) => {
    setBanPrompt({ userId, username });
    setBanReason("");
  };

  const handleBanConfirm = () => {
    if (banPrompt && banReason.trim()) {
      dispatch(banUser({ userId: banPrompt.userId, reason: banReason.trim() }));
      setBanPrompt(null);
      setBanReason("");
    }
  };

  const handleBanCancel = () => {
    if (banPrompt) {
      dispatch(clearBanError(banPrompt.userId));
      setBanPrompt(null);
      setBanReason("");
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Users List ({totalCount})</h3>
      </div>

      {status === "loading" && (
        <p className={styles.loading}>Loading users...</p>
      )}
      {status === "failed" && <p className={styles.error}>Error: {error}</p>}

      {status === "succeeded" && users.length === 0 && (
        <p className={styles.noData}>No users found.</p>
      )}

      {status === "succeeded" && users.length > 0 && (
        <>
          <div className={styles.userGrid}>
            {users.map((user: User) => (
              <div key={user.id} className={styles.userCard}>
                {/* <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.username}
                  className={styles.profilePicture}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150";
                  }}
                /> */}
                <h3>{user.username}</h3>
                <p>Email: {user.email}</p>
                <p>Name: {user.fullName || "N/A"}</p>
                <p>Followers: {user.followersCount}</p>
                <p>Following: {user.followingCount}</p>
                <p>Status: {user.isBanned ? "Banned" : "Active"}</p>
                {user.isBanned && <p>Reason: {user.banReason || "N/A"}</p>}
                {!user.isBanned && (
                  <button
                    className={styles.banButton}
                    onClick={() => handleBanClick(user.id, user.username)}
                    disabled={banStatus[user.id] === "loading"}
                  >
                    {banStatus[user.id] === "loading"
                      ? "Banning..."
                      : "Ban User"}
                  </button>
                )}
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
              Previous
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => handlePageChange(page + 1)}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}

      {banPrompt && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Ban User: {banPrompt.username}</h2>
            <label htmlFor="banReason">Reason for Ban:</label>
            <textarea
              id="banReason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className={styles.banReasonInput}
              placeholder="Enter ban reason (e.g., Violation of community guidelines)"
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleBanConfirm}
                className={styles.confirmButton}
                disabled={
                  !banReason.trim() || banStatus[banPrompt.userId] === "loading"
                }
              >
                Confirm
              </button>
              <button onClick={handleBanCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
