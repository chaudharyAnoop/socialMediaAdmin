import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../redux/store";
import {
  clearError,
  fetchFollowers,
  fetchFollowing,
} from "../../redux/userFollowSlice";

import {
  selectFollowers,
  selectFollowing,
  selectUserFollowLoading,
  selectUserFollowError,
} from "../../redux/selectors/userFollowSelector";

import UserChart from "../charts/UserChart";
import styles from "./userFollow.module.css";

const UserFollow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { followers, following, loading, error } = useSelector(
    (state: RootState) => ({
      followers: selectFollowers(state),
      following: selectFollowing(state),
      loading: selectUserFollowLoading(state),
      error: selectUserFollowError(state),
    })
  );
  const [userId, setUserId] = useState<string>("684803c50574c4ee41ed21a8");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRmYmRlN2U4Y2NhNGJlNGM4ZDI3MDkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZGV2aWNlSWQiOiJUZXN0SWQiLCJpcEFkZHJlc3MiOiI6OmZmZmY6MTcyLjUwLjUuMTE0IiwidXNlckFnZW50IjoiZHNhIiwiaWF0IjoxNzUwODI2MDQxLCJleHAiOjE3NTA4MjkwNDEsInN1YiI6IjY4NGZiZGU3ZThjY2E0YmU0YzhkMjcwOSJ9.rB3PgWecsds0k6MvHpemWxUpV2wqRZN4e8mwT_uvKyk"
    );
  }, []);

  const handleFetchFollowers = () => {
    if (userId) {
      dispatch(fetchFollowers({ userId }));
    }
  };

  const handleFetchFollowing = () => {
    if (userId) {
      dispatch(fetchFollowing({ userId }));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className={styles.container}>
      <h2>User Follow Stats</h2>
      <div className={styles.inputGroup}>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className={styles.input}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button
          onClick={handleFetchFollowers}
          disabled={loading || !userId}
          className={styles.button}
        >
          Get Followers
        </button>
        <button
          onClick={handleFetchFollowing}
          disabled={loading || !userId}
          className={styles.button}
        >
          Get Following
        </button>
      </div>
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={handleClearError} className={styles.clearButton}>
            Clear Error
          </button>
        </div>
      )}
      <div className={styles.results}>
        <p>Followers: {followers.totalCount}</p>
        <p>Following: {following.totalCount}</p>
      </div>
      <div className={styles.chart}>
        <UserChart
          activeUsers={followers.totalCount > 0 ? followers.totalCount : 10}
          blockedUsers={following.totalCount > 0 ? following.totalCount : 5}
        />
      </div>
    </div>
  );
};

export default UserFollow;
