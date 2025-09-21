import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import AuthDialog from "./AuthDialog";

const Home = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "EXPLORE A WORLD MADE OF YOUR IDEAS";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const handleLogout = () => {
    logout();
  };

  const handleChatButtonClick = () => {
    navigate("/chat");
  };

  const handleExploreButtonClick = () => {
    navigate("/dashboard");
  };

  const handleAuthButtonClick = (mode) => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };

  const handleAboutClick = () => {
    navigate("/features");
  };

  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  const handleSwitchAuthMode = () => {
    setAuthMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
  };

  return (
    <div className="video-background-container">
      <video autoPlay loop muted className="background-video">
        <source src="/assets/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h1 className="main-heading">
          {displayText}
          <span className="cursor">|</span>
        </h1>
        <div className="button-container">
          <button onClick={handleChatButtonClick} className="start-button">
            Evaluate My Idea
          </button>
          <button onClick={handleExploreButtonClick} className="explore-button">
            Explore the World
          </button>
        </div>
      </div>
      <div className="info">
        {isAuthenticated() ? (
          <div className="user-profile">
            <span className="profile-icon">👤</span>
            <span className="user-name">{user?.name || "User"}</span>
            <button
              className="auth-button"
              onClick={() => navigate("/dashboard")}
            >
              My Ideas
            </button>
            <button className="auth-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              className="auth-button"
              onClick={() => handleAuthButtonClick("login")}
            >
              Login
            </button>
            <button className="auth-button" onClick={handleAboutClick}>
              About
            </button>
            <button
              className="auth-button"
              onClick={() => handleAuthButtonClick("signup")}
            >
              Signup
            </button>
          </>
        )}
        <h1 className="flawender-heading">Flawender</h1>
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={handleCloseAuthDialog}
        mode={authMode}
        onSwitchMode={handleSwitchAuthMode}
      />
    </div>
  );
};

export default Home;
