import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../style/login.css";

export function UserLogin() {
  const [getUser, setUser] = useState({ UserId: "", Password: "" });
  const [getError, setError] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user-id", "token"]);

  function handleIdChange(e) {
    setUser({
      UserId: e.target.value,
      Password: getUser.Password,
    });
  }

  function handlePwdChange(e) {
    setUser({
      UserId: getUser.UserId,
      Password: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:2700/login",
      data: {
        UserId: getUser.UserId,
        Password: getUser.Password,
      },
    })
      .then((response) => {
        const token = response.data.token;
        if (token) {
          setCookie("user-id", getUser.UserId);
          setCookie("token", token);
          navigate("/taskmanager");
        } else {
          setError("Invalid Credentials");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          setError("Unauthorized: Invalid credentials");
        } else {
          setError("Network Error. Please try again later.");
        }
      });
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="custom-input">
            <label htmlFor="UserId">User Id</label>
            <input
              type="text"
              id="UserId"
              onChange={handleIdChange}
              value={getUser.UserId}
              required
              className="gray-background"
            />
          </div>
          <div className="custom-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={handlePwdChange}
              value={getUser.Password}
              required
              className="gray-background"
            />
          </div>
          <button type="submit" className="custom-button">
            Login
          </button>
          {getError && <p className="error-message">{getError}</p>}
        </form>
        <div className="register-link">
          <p>Don't have an account?</p>
          <button className="register-button" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
