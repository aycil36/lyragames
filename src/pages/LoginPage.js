import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import mascotImage from "../assets/sticker3.jpeg";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // "admin" or "user"
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim() || !role) {
      alert("Please enter a username and select a role.");
      return;
    }
    
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("role", role);

    if (role === "admin") {
      navigate("/");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button onClick={handleLogin}>Login</button>
      </div>

      <img src={mascotImage} alt="Login Visual" className="login-mascot" />
    </div>
  );
}

export default LoginPage;
