import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AdminUserSearch.module.css";
import type { AppDispatch, RootState } from "../../redux/store";
import { findUserByEmail, resetUserSearch } from "../../redux/userSearchSlice";

const AdminUserSearch: React.FC = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user, status, error } = useSelector(
    (state: RootState) => state.userSearch
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      dispatch(findUserByEmail(email.trim()));
    }
  };

  const handleReset = () => {
    setEmail("");
    dispatch(resetUserSearch());
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Find User by Email</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          className={styles.input}
          required
        />
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.button}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      </form>
      {status === "failed" && <p className={styles.error}>{error}</p>}
      {status === "succeeded" && user && (
        <div className={styles.userCard}>
          <h3 className={styles.userTitle}>
            {user.fullName} (@{user.username})
          </h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio || "N/A"}
          </p>
          <p>
            <strong>Account Type:</strong> {user.accountType}
          </p>
          <p>
            <strong>Followers:</strong> {user.followersCount}
          </p>
          <p>
            <strong>Following:</strong> {user.followingCount}
          </p>
          <p>
            <strong>Banned:</strong>{" "}
            {user.isBanned
              ? `Yes (${user.banReason || "No reason provided"})`
              : "No"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUserSearch;
