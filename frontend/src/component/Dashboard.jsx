import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MOCK_IDEAS } from "./MockData";
import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");
  const [ideas, setIdeas] = useState([]);
  const [topIdeas, setTopIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      // If mock fallback is needed right away (e.g. valid endpoint but empty DB)
      // we check result.
      const response = await fetch(`${API_BASE_URL}/ideas`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }
      
      const data = await response.json();
      
      if (!data.ideas || data.ideas.length === 0) {
        console.warn("Dashboard: Ideas empty, using MOCK DATA.");
        setIdeas(MOCK_IDEAS);
      } else {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      // Fallback on error
      console.warn("Dashboard: Fetch failed, using MOCK DATA.");
      setIdeas(MOCK_IDEAS);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/ideas/leaderboard?period=${period}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      
      const data = await response.json();
      
      if (!data.ideas || data.ideas.length === 0) {
         setTopIdeas(MOCK_IDEAS);
      } else {
         setTopIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setTopIdeas(MOCK_IDEAS);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleLike = async (ideaId, e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      alert("Please log in to like ideas");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Optimistic update or refetch
        fetchIdeas();
        fetchLeaderboard();
      }
    } catch (error) {
      console.error("Error liking idea:", error);
    }
  };

  const toggleComments = (ideaId, e) => {
    e.stopPropagation();
    setShowComments(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId]
    }));
  };

  const handleComment = async (ideaId, e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      alert("Please log in to comment");
      return;
    }

    const text = commentInputs[ideaId];
    if (!text?.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setCommentInputs(prev => ({
          ...prev,
          [ideaId]: ""
        }));
        fetchIdeas();
        fetchLeaderboard();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCardClick = (idea) => {
    navigate("/output-card", {
      state: {
        analysis: idea.analysis || `\n\nDescription:\n${idea.description}\n\nPositives:\n${idea.positive || ''}\n\nNegatives:\n${idea.negative || ''}\n\nHonest Verdict Tagline:\n"${idea.verdict}"`,
        userInput: idea.title,
        savedIdea: idea
      }
    });
  };

  return (
    <div className="dashboard-container">
      <video autoPlay loop muted className="dashboard-background-video">
        <source src="/assets/home.mp4" type="video/mp4" />
      </video>
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Community Dashboard</h1>
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent Ideas
            </button>
            <button
              className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {activeTab === "recent" ? (
          <div className="ideas-grid">
            {loading ? (
              <div className="loading">Loading ideas...</div>
            ) : ideas.length === 0 ? (
              <div className="no-ideas">
                <p>No ideas shared yet. Be the first!</p>
                <button onClick={() => navigate("/chat")}>Share Idea</button>
              </div>
            ) : (
              ideas.map((idea) => (
                <div key={idea.id} className="idea-card" onClick={() => handleCardClick(idea)}>
                  <div className="idea-header">
                    <h3>{idea.title}</h3>
                    <span className="idea-author">by {idea.user ? idea.user.name : "Anonymous"}</span>
                  </div>
                  <p className="idea-description">{idea.description}</p>
                  <div className="idea-verdict">
                    <strong>Verdict:</strong> {idea.verdict}
                  </div>
                  
                  <div className="idea-actions">
                    <button
                      className={`like-button ${
                        idea.likes && idea.likes.some(like => like.user?.id === user?.id) ? 'liked' : ''
                      }`}
                      onClick={(e) => handleLike(idea.id, e)}
                    >
                      {idea.likes && idea.likes.some(like => like.user?.id === user?.id) ? "❤️" : "🤍"} {idea.likes ? idea.likes.length : 0}
                    </button>
                    <button
                      className="comment-button"
                      onClick={(e) => toggleComments(idea.id, e)}
                    >
                      💬 {idea.comments ? idea.comments.length : 0}
                    </button>
                  </div>

                  {showComments[idea.id] && (
                    <div className="comments-section" onClick={e => e.stopPropagation()}>
                    {idea.comments && idea.comments.length > 0 ? (
                        <div className="comments-list">
                        {idea.comments.map((comment, index) => (
                            <div key={comment.id || index} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">{comment.user ? comment.user.name : "User"}</span>
                                <span className="comment-date">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                                </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="no-comments">No comments yet.</p>
                    )}
                    
                    {isAuthenticated() && (
                      <div className="comment-input">
                        <input
                          type="text"
                          value={commentInputs[idea.id] || ""}
                          onChange={(e) =>
                            setCommentInputs(prev => ({
                              ...prev,
                              [idea.id]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => handleComment(idea.id, e)}
                          className="comment-submit"
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          </div>
        ) : (
          <div className="leaderboard-section">
             <div className="leaderboard-filters">
                <div className="period-selector">
                  <button onClick={() => setPeriod('all')} className={`period-btn ${period === 'all' ? 'active' : ''}`}>All Time</button>
                  <button onClick={() => setPeriod('week')} className={`period-btn ${period === 'week' ? 'active' : ''}`}>This Week</button>
                  <button onClick={() => setPeriod('month')} className={`period-btn ${period === 'month' ? 'active' : ''}`}>This Month</button>
                </div>
             </div>

            {leaderboardLoading ? (
              <div className="loading">Loading top ideas...</div>
            ) : topIdeas.length === 0 ? (
              <div className="no-ideas">
                <p>No ideas found for the selected period.</p>
                <button
                  onClick={() => navigate("/chat")}
                  className="evaluate-button"
                >
                  Be the First to Share
                </button>
              </div>
            ) : (
              <div className="leaderboard-list">
                {topIdeas.map((idea, index) => {
                  const getRankEmoji = (rank) => {
                    switch (rank) {
                      case 1: return "🏆";
                      case 2: return "🥈";
                      case 3: return "🥉";
                      default: return `#${rank}`;
                    }
                  };

                  const getRankClass = (rank) => {
                    switch (rank) {
                      case 1: return "rank-gold";
                      case 2: return "rank-silver";
                      case 3: return "rank-bronze";
                      default: return "rank-default";
                    }
                  };

                  return (
                    <div
                      key={idea.id}
                      className={`leaderboard-item ${getRankClass(index + 1)}`}
                      onClick={() => handleCardClick(idea)}
                    >
                      <div className="rank-section">
                        <div className="rank-badge">
                          {getRankEmoji(index + 1)}
                        </div>
                        <div className="rank-number">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="idea-info">
                        <div className="idea-header">
                          <h3 className="idea-title">{idea.title}</h3>
                          <span className="idea-author">by {idea.user ? idea.user.name : "Anonymous"}</span>
                        </div>
                        
                        <p className="idea-description">
                           {idea.description}
                        </p>
                        
                        <div className="idea-verdict">
                          <strong>Verdict:</strong> "{idea.verdict}"
                        </div>
                      </div>

                      <div className="engagement-section">
                        <div className="metrics">
                          <div className="metric">
                            <span className="metric-icon">❤️</span>
                            <span className="metric-count">{idea.likes ? idea.likes.length : 0}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-icon">💬</span>
                            <span className="metric-count">{idea.comments ? idea.comments.length : 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="idea-actions">
                        <div className="like-section">
                          <button
                            className={`like-button ${
                              idea.likes && idea.likes.some(like => like.user?.id === user?.id) ? 'liked' : ''
                            }`}
                            onClick={(e) => handleLike(idea.id, e)}
                          >
                            {idea.likes && idea.likes.some(like => like.user?.id === user?.id) ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <button
                          className="comment-button"
                          onClick={(e) => toggleComments(idea.id, e)}
                        >
                          💬 {idea.comments ? idea.comments.length : 0}
                        </button>
                      </div>
                      
                      {showComments[idea.id] && (
                        <div
                          className="comments-section"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="comments-list">
                            {idea.comments && idea.comments.map((comment, i) => (
                              <div key={comment.id || i} className="comment">
                                <div className="comment-header">
                                  <span className="comment-author">{comment.user ? comment.user.name : "User"}</span>
                                  <span className="comment-date">
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                                  </span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                              </div>
                            ))}
                          </div>
                   
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
