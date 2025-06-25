import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./adminLogin.module.css";
import type { AppDispatch, RootState } from "../../redux/store";
import { clearError, login } from "../../redux/authSlice";

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("password123");

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email && password) {
      dispatch(login({ email, password }));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className={styles.container}>
      <h2>Admin Login</h2>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className={styles.input}
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
            disabled={loading}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={handleClearError} className={styles.clearButton}>
              Clear Error
            </button>
          </div>
        )}
        {accessToken && (
          <div className={styles.success}>
            <p>Login successful! Access token received.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
