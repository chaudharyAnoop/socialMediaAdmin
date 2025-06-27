import React, { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../redux/store";
import { clearError, login } from "../../redux/authSlice";

import styles from "./adminLogin.module.css";
import Strings from "../../constants/strings";

type State = {
  email: string;
  password: string;
  showPassword: boolean;
  emailError: string;
  passwordError: string;
};

import { ActionType } from "../../constants/enums";

type Action =
  | { type: ActionType.SET_EMAIL; payload: string }
  | { type: ActionType.SET_PASSWORD; payload: string }
  | { type: ActionType.TOGGLE_SHOW_PASSWORD }
  | { type: ActionType.SET_EMAIL_ERROR; payload: string }
  | { type: ActionType.SET_PASSWORD_ERROR; payload: string }
  | { type: ActionType.CLEAR_ERRORS };

const initialState: State = {
  email: "",
  password: "",
  showPassword: false,
  emailError: "",
  passwordError: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SET_EMAIL:
      return { ...state, email: action.payload };
    case ActionType.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ActionType.TOGGLE_SHOW_PASSWORD:
      return { ...state, showPassword: !state.showPassword };
    case ActionType.SET_EMAIL_ERROR:
      return { ...state, emailError: action.payload };
    case ActionType.SET_PASSWORD_ERROR:
      return { ...state, passwordError: action.payload };
    case ActionType.CLEAR_ERRORS:
      return { ...state, emailError: "", passwordError: "" };
    default:
      return state;
  }
}

const AdminLogin: React.FC = () => {
  const dispatchRedux = useDispatch<AppDispatch>();
  const { loading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const validateForm = () => {
    let valid = true;
    if (!state.email) {
      dispatch({
        type: ActionType.SET_EMAIL_ERROR,
        payload: "Email is required",
      });
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      dispatch({
        type: ActionType.SET_EMAIL_ERROR,
        payload: "Invalid email format",
      });
      valid = false;
    } else {
      dispatch({ type: ActionType.SET_EMAIL_ERROR, payload: "" });
    }

    if (!state.password) {
      dispatch({
        type: ActionType.SET_PASSWORD_ERROR,
        payload: "Password is required",
      });
      valid = false;
    } else {
      dispatch({ type: ActionType.SET_PASSWORD_ERROR, payload: "" });
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      dispatchRedux(login({ email: state.email, password: state.password }));
    }
  };

  const handleClearError = () => {
    dispatchRedux(clearError());
  };

  return (
    <div className={styles.container} role="main">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.title}>{Strings.ADMIN_LOGIN_TITLE}</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email">{Strings.EMAIL_INPUT_LABEL}</label>
          <input
            id="email"
            type="email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: ActionType.SET_EMAIL, payload: e.target.value })
            }
            placeholder={Strings.EMAIL_INPUT_PLACEHOLDER}
            className={`${styles.input} ${
              state.emailError ? styles.inputError : ""
            }`}
            disabled={loading}
            aria-invalid={!!state.emailError}
            aria-describedby="email-error"
            required
          />
          {state.emailError && (
            <span id="email-error" className={styles.errorMessage}>
              {state.emailError}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">{Strings.PASSWORD_INPUT_LABEL}</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={state.showPassword ? "text" : "password"}
              value={state.password}
              onChange={(e) =>
                dispatch({
                  type: ActionType.SET_PASSWORD,
                  payload: e.target.value,
                })
              }
              placeholder={Strings.PASSWORD_INPUT_PLACEHOLDER}
              className={`${styles.input} ${
                state.passwordError ? styles.inputError : ""
              }`}
              disabled={loading}
              aria-invalid={!!state.passwordError}
              aria-describedby="password-error"
              required
            />
            <button
              type="button"
              className={styles.showPasswordToggle}
              onClick={() =>
                dispatch({ type: ActionType.TOGGLE_SHOW_PASSWORD })
              }
              aria-label={
                state.showPassword ? "Hide password" : "Show password"
              }
              tabIndex={-1}
            >
              {state.showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {state.passwordError && (
            <span id="password-error" className={styles.errorMessage}>
              {state.passwordError}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? Strings.LOGGING_IN : Strings.LOGIN}
        </button>

        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
            <button onClick={handleClearError} className={styles.clearButton}>
              {Strings.CLEAR_ERROR}
            </button>
          </div>
        )}

        {accessToken && (
          <div className={styles.success} role="status">
            <p>{Strings.LOGIN_SUCCESS}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
