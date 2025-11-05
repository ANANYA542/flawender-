import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [topIdeas, setTopIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'leaderboard'
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ideas`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch ideas');
        }
        
        const data = await response.json();
        
        const validIdeas = data.ideas.map((idea) => ({
          id: idea.id,
          title: `Idea #${idea.id}`,
          description: idea.Description || "No description available",
          verdict: idea.Verdict || "No verdict provided",
          user: idea.user || { name: "Anonymous" },
          likes: idea.likes || [],
          comments: idea.comments || [],
          createdAt: idea.createdAt,
        }));

        setIdeas(validIdeas);
        setError(null);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setError("Failed to load ideas. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [leaderboardPeriod, activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const response = await fetch(`${API_BASE_URL}/ideas/leaderboard?period=${leaderboardPeriod}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      
      const validTopIdeas = data.ideas.map((idea) => ({
        id: idea.id,
        title: `Idea #${idea.id}`,
        description: idea.Description || "No description available",
        verdict: idea.Verdict || "No verdict provided",
        user: idea.user || { name: "Anonymous" },
        likes: idea.likes || [],
        comments: idea.comments || [],
        createdAt: idea.createdAt,
        engagementScore: idea.engagementScore || 0,
      }));
      
      setTopIdeas(validTopIdeas);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const result = await response.json();
      
      // Update the ideas state to reflect the like change
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => {
          if (idea.id === ideaId) {
            if (result.liked) {
              // Add like
              return {
                ...idea,
                likes: [...idea.likes, { user: { id: user.id, name: user.name } }]
              };
            } else {
              // Remove like
              return {
                ...idea,
                likes: idea.likes.filter(like => like.user.id !== user.id)
              };
            }
          }
          return idea;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to toggle like');
    }
  };

  const handleComment = async (ideaId, e) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert("Please log in to comment");
      return;
    }

    const commentText = commentInputs[ideaId];
    if (!commentText?.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const result = await response.json();
      
      // Update the ideas state to add the new comment
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => {
          if (idea.id === ideaId) {
            return {
              ...idea,
              comments: [result.comment, ...idea.comments]
            };
          }
          return idea;
        })
      );
      
      // Clear comment input
      setCommentInputs(prev => ({ ...prev, [ideaId]: "" }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const toggleComments = (ideaId, e) => {
    e.stopPropagation();
    setShowComments(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId]
    }));
  };

  const handleCardClick = (idea) => {
    navigate("/output-card", {
      state: {
        analysis: `Description:\n${idea.description}\n\nHonest Verdict Tagline:\n"${idea.verdict}"`,
        userInput: idea.title,
      },
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your ideas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <video
        className="dashboard-background-video"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        src="https://cdn.pixabay.com/vimeo/328816816/Background%20-%2011089.mp4?width=1280&hash=0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c"
        onError={(e) => console.error("Video error:", e)}
      />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Explore Ideas</h1>
          
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              🌍 All Ideas
            </button>
            <button 
              className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏆 Top Ideas
            </button>
          </div>
          
          {activeTab === 'leaderboard' && (
            <div className="leaderboard-filters">
              <div className="period-selector">
                <button 
                  className={`period-btn ${leaderboardPeriod === 'all' ? 'active' : ''}`}
                  onClick={() => setLeaderboardPeriod('all')}
                >
                  All Time
                </button>
                <button 
                  className={`period-btn ${leaderboardPeriod === 'month' ? 'active' : ''}`}
                  onClick={() => setLeaderboardPeriod('month')}
                >
                  This Month
                </button>
                <button 
                  className={`period-btn ${leaderboardPeriod === 'week' ? 'active' : ''}`}
                  onClick={() => setLeaderboardPeriod('week')}
                >
                  This Week
                </button>
              </div>
              <div className="scoring-info">
                <span className="score-rule">❤️ = 3pts</span>
                <span className="score-rule">💬 = 1pt</span>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'all' ? (
          <div className="ideas-grid">
          {ideas.length === 0 ? (
            <div className="no-ideas">
              <p>No ideas have been shared yet.</p>
              <button
                onClick={() => navigate("/chat")}
                className="evaluate-button"
              >
                Be the First to Share
              </button>
            </div>
          ) : (
            ideas.map((idea) => (
              <div
                key={idea.id}
                className="idea-card"
                onClick={() => handleCardClick(idea)}
              >
                <div className="idea-header">
                  <h3 className="idea-title">{idea.title}</h3>
                  <span className="idea-author">by {idea.user.name}</span>
                </div>
                <p className="idea-description">{idea.description}</p>
                <div className="idea-verdict">
                  <strong>Verdict:</strong> {idea.verdict}
                </div>
                
                <div className="idea-actions">
                  <div className="like-section">
                    <button
                      className={`like-button ${
                        idea.likes.some(like => like.user.id === user?.id) ? 'liked' : ''
                      }`}
                      onClick={(e) => handleLike(idea.id, e)}
                    >
                      {idea.likes.some(like => like.user.id === user?.id) ? "❤️" : "🤍"}
                    </button>
                    <span className="like-count">{idea.likes.length}</span>
                  </div>
                  <button
                    className="comment-button"
                    onClick={(e) => toggleComments(idea.id, e)}
                  >
                    💬 {idea.comments.length}
                  </button>
                </div>
                
                <div className="idea-date">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </div>
                
                {showComments[idea.id] && (
                  <div
                    className="comments-section"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="comments-list">
                      {idea.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <span className="comment-author">{comment.user.name}</span>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      ))}
                    </div>
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
                          <span className="idea-author">by {idea.user.name}</span>
                        </div>
                        
                        <p className="idea-description">
                          {idea.description.length > 120 
                            ? `${idea.description.substring(0, 120)}...` 
                            : idea.description
                          }
                        </p>
                        
                        <div className="idea-verdict">
                          <strong>Verdict:</strong> "{idea.verdict}"
                        </div>
                      </div>

                      <div className="engagement-section">
                        <div className="engagement-score">
                          <div className="score-value">{idea.engagementScore}</div>
                          <div className="score-label">Score</div>
                        </div>
                        
                        <div className="metrics">
                          <div className="metric">
                            <span className="metric-icon">❤️</span>
                            <span className="metric-count">{idea.likes.length}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-icon">💬</span>
                            <span className="metric-count">{idea.comments.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="idea-actions">
                        <div className="like-section">
                          <button
                            className={`like-button ${
                              idea.likes.some(like => like.user.id === user?.id) ? 'liked' : ''
                            }`}
                            onClick={(e) => handleLike(idea.id, e)}
                          >
                            {idea.likes.some(like => like.user.id === user?.id) ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <button
                          className="comment-button"
                          onClick={(e) => toggleComments(idea.id, e)}
                        >
                          💬 {idea.comments.length}
                        </button>
                      </div>

                      <div className="idea-date">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </div>

                      {showComments[idea.id] && (
                        <div
                          className="comments-section"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="comments-list">
                            {idea.comments.map((comment) => (
                              <div key={comment.id} className="comment">
                                <div className="comment-header">
                                  <span className="comment-author">{comment.user.name}</span>
                                  <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                              </div>
                            ))}
                          </div>
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
