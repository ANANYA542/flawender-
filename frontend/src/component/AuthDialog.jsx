import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthDialog.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthDialog = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        const data = {
          name: formData.name || formData.email.split("@")[0],
          email: formData.email,
          password: formData.password,
        };

        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Signup failed');
        }

        login(result.user, result.token);
        alert("Sign-up successful!");
      } else {
        const data = {
          email: formData.email,
          password: formData.password,
        };

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Login failed');
        }

        login(result.user, result.token);
        alert("Login successful!");
      }

      onClose();
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit" className="submit-button">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="switch-mode">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button onClick={onSwitchMode} className="switch-button">
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthDialog;
