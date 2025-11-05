import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import AuthDialog from "./AuthDialog";
import UserProfiles from "./UserProfiles";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { user, isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isUserProfilesOpen, setIsUserProfilesOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [exampleLikes, setExampleLikes] = useState(new Set());
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Example ideas to show when no real ideas exist
  const exampleIdeas = [
    {
      id: 'example-1',
      title: 'AI-Powered Fitness Coach',
      description: 'A mobile app that uses AI to create personalized workout plans based on your fitness level, goals, and available equipment. It adapts in real-time based on your performance and provides motivation through gamification.',
      verdict: 'Promising concept with strong market potential in the growing fitness tech sector.',
      user: { name: 'Sarah Chen', id: 'example-user-1' },
      likes: [
        { user: { id: 'example-user-2', name: 'Mike Johnson' } },
        { user: { id: 'example-user-3', name: 'Emma Davis' } },
        { user: { id: 'example-user-4', name: 'Alex Rodriguez' } }
      ],
      comments: [
        {
          id: 'comment-1',
          text: 'This sounds amazing! I would definitely use this app.',
          user: { name: 'Mike Johnson' },
          createdAt: new Date('2024-01-15T10:30:00Z')
        },
        {
          id: 'comment-2',
          text: 'Great idea! Have you considered integration with wearable devices?',
          user: { name: 'Emma Davis' },
          createdAt: new Date('2024-01-15T11:45:00Z')
        }
      ],
      createdAt: new Date('2024-01-15T09:00:00Z')
    },
    {
      id: 'example-2',
      title: 'Smart Plant Care System',
      description: 'An IoT device that monitors soil moisture, light levels, and temperature for houseplants. It sends notifications to your phone and can automatically water plants when needed.',
      verdict: 'Solid niche market opportunity with potential for subscription-based plant care services.',
      user: { name: 'David Park', id: 'example-user-5' },
      likes: [
        { user: { id: 'example-user-1', name: 'Sarah Chen' } },
        { user: { id: 'example-user-6', name: 'Lisa Wong' } }
      ],
      comments: [
        {
          id: 'comment-3',
          text: 'Perfect for people like me who travel frequently!',
          user: { name: 'Lisa Wong' },
          createdAt: new Date('2024-01-14T16:20:00Z')
        }
      ],
      createdAt: new Date('2024-01-14T14:30:00Z')
    },
    {
      id: 'example-3',
      title: 'Virtual Study Groups Platform',
      description: 'A platform that connects students studying the same subjects to form virtual study groups. Features include shared whiteboards, video calls, progress tracking, and AI-powered study recommendations.',
      verdict: 'Excellent timing with the rise of remote learning. Strong potential for educational institutions.',
      user: { name: 'Priya Sharma', id: 'example-user-7' },
      likes: [
        { user: { id: 'example-user-2', name: 'Mike Johnson' } },
        { user: { id: 'example-user-5', name: 'David Park' } },
        { user: { id: 'example-user-8', name: 'Tom Wilson' } },
        { user: { id: 'example-user-9', name: 'Anna Lee' } }
      ],
      comments: [
        {
          id: 'comment-4',
          text: 'This would have been so helpful during my college years!',
          user: { name: 'Tom Wilson' },
          createdAt: new Date('2024-01-13T20:15:00Z')
        },
        {
          id: 'comment-5',
          text: 'Love the AI recommendations feature. How would you handle different learning styles?',
          user: { name: 'Anna Lee' },
          createdAt: new Date('2024-01-13T21:30:00Z')
        }
      ],
      createdAt: new Date('2024-01-13T18:45:00Z')
    },
    {
      id: 'example-4',
      title: 'Sustainable Packaging Marketplace',
      description: 'A B2B marketplace connecting businesses with eco-friendly packaging suppliers. Features include sustainability scoring, bulk ordering, and carbon footprint tracking.',
      verdict: 'Timely concept addressing growing environmental concerns. Strong B2B market potential.',
      user: { name: 'Carlos Martinez', id: 'example-user-10' },
      likes: [
        { user: { id: 'example-user-1', name: 'Sarah Chen' } },
        { user: { id: 'example-user-7', name: 'Priya Sharma' } }
      ],
      comments: [
        {
          id: 'comment-6',
          text: 'This addresses a real pain point for small businesses trying to go green.',
          user: { name: 'Sarah Chen' },
          createdAt: new Date('2024-01-12T13:45:00Z')
        }
      ],
      createdAt: new Date('2024-01-12T11:20:00Z')
    }
  ];

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
      // Don't set error, just use empty ideas array so example ideas will show
      setIdeas([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (ideaId, e) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert("Please log in to like ideas");
      return;
    }

    // Handle example ideas (demo functionality)
    if (typeof ideaId === 'string' && ideaId.startsWith('example-')) {
      if (exampleLikes.has(ideaId)) {
        setExampleLikes(prev => {
          const newSet = new Set(prev);
          newSet.delete(ideaId);
          return newSet;
        });
      } else {
        setExampleLikes(prev => new Set([...prev, ideaId]));
      }
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
      
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => {
          if (idea.id === ideaId) {
            if (result.liked) {
              return {
                ...idea,
                likes: [...idea.likes, { user: { id: user.id, name: user.name } }]
              };
            } else {
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

    // Handle example ideas (demo functionality)
    if (typeof ideaId === 'string' && ideaId.startsWith('example-')) {
      alert("This is a demo idea. Create your own ideas to interact with real content!");
      return;
    }

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
    setSelectedIdea(idea);
  };

  const closeIdeaModal = () => {
    setSelectedIdea(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleChatButtonClick = () => {
    navigate("/chat");
  };

  const handleAuthButtonClick = (mode) => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };

  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  const handleSwitchAuthMode = () => {
    setAuthMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
  };

  const handleConnectClick = () => {
    if (!isAuthenticated()) {
      alert("Please log in to connect with users");
      return;
    }
    setIsUserProfilesOpen(true);
  };

  const handleUserProfileClick = () => {
    if (!isAuthenticated()) {
      alert("Please log in to view your profile");
      return;
    }
    setIsUserProfileOpen(true);
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button onClick={handleConnectClick} className="sidebar-button">
          🌐 Connect
        </button>
        <button onClick={handleChatButtonClick} className="sidebar-button">
          💡 Evaluate My Idea
        </button>
        <button onClick={handleLeaderboardClick} className="sidebar-button">
          🏆 Leaderboard
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="logo-section">
            <h1 className="flawender-logo">Flawender</h1>
            <p className="tagline">Explore a world made of your ideas</p>
          </div>
          
          <div className="auth-section">
            {isAuthenticated() ? (
              <div className="user-profile">
                <div className="profile-info" onClick={handleUserProfileClick}>
                  <span className="profile-icon">👤</span>
                  <span className="user-name">{user?.name || "User"}</span>
                </div>
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
                <button
                  className="auth-button"
                  onClick={() => handleAuthButtonClick("signup")}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ideas Feed */}
        <div className="ideas-feed">
          {loading ? (
            <div className="loading">Loading ideas...</div>
          ) : (
            <>
              {(ideas.length > 0 ? ideas : exampleIdeas).map((idea) => (
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
                        (typeof idea.id === 'string' && idea.id.startsWith('example-')) 
                          ? (exampleLikes.has(idea.id) ? 'liked' : '')
                          : (idea.likes.some(like => like.user.id === user?.id) ? 'liked' : '')
                      }`}
                      onClick={(e) => handleLike(idea.id, e)}
                    >
                      {(typeof idea.id === 'string' && idea.id.startsWith('example-')) 
                        ? (exampleLikes.has(idea.id) ? "❤️" : "🤍")
                        : (idea.likes.some(like => like.user.id === user?.id) ? "❤️" : "🤍")
                      }
                    </button>
                    <span className="like-count">
                      {(typeof idea.id === 'string' && idea.id.startsWith('example-')) 
                        ? idea.likes.length + (exampleLikes.has(idea.id) ? 1 : 0)
                        : idea.likes.length
                      }
                    </span>
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
              }
            </>
          )}
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2>About Flawender</h2>
          <p className="about-description">
            Flawender is an AI-powered platform designed to help entrepreneurs and innovators validate their startup ideas. 
            Our comprehensive analysis provides instant feedback on market potential, target audience identification, and strategic recommendations.
          </p>
          <p className="about-text">
            Our platform offers comprehensive idea validation through advanced AI analysis, providing deep insights into market trends and opportunities. 
            We help you identify and understand your potential customers while delivering quick, actionable results in minutes. 
            Whether you're a seasoned entrepreneur or just starting your journey, Flawender empowers you to make informed decisions about your business ideas.
          </p>
        </div>
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={handleCloseAuthDialog}
        mode={authMode}
        onSwitchMode={handleSwitchAuthMode}
      />

      <UserProfiles
        isOpen={isUserProfilesOpen}
        onClose={() => setIsUserProfilesOpen(false)}
      />

      {/* User Profile Modal */}
      {isUserProfileOpen && (
        <div className="user-profile-modal-overlay" onClick={() => setIsUserProfileOpen(false)}>
          <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-profile-header">
              <h2>My Profile</h2>
              <button className="close-button" onClick={() => setIsUserProfileOpen(false)}>×</button>
            </div>
            
            <div className="user-profile-content">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="profile-info">
                  <h3>{user?.name || "User"}</h3>
                  <p className="profile-bio">Welcome to Flawender! Share your innovative ideas and connect with fellow entrepreneurs.</p>
                  <div className="profile-stats">
                    <span className="stat">💡 {ideas.length} ideas</span>
                    <span className="stat">❤️ {exampleLikes.size} likes given</span>
                    <span className="stat">👥 0 friends</span>
                  </div>
                </div>
              </div>

              <div className="profile-sections">
                <div className="profile-section">
                  <h4>My Ideas ({ideas.length})</h4>
                  <div className="profile-ideas">
                    {ideas.length > 0 ? (
                      ideas.map((idea) => (
                        <div key={idea.id} className="profile-idea-card">
                          <h5>{idea.title}</h5>
                          <p>{idea.description}</p>
                          <div className="idea-stats">
                            <span>❤️ {idea.likes?.length || 0}</span>
                            <span>💬 {idea.comments?.length || 0}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-ideas-message">
                        <p>You haven't shared any ideas yet.</p>
                        <button 
                          className="create-idea-button"
                          onClick={() => {
                            setIsUserProfileOpen(false);
                            handleChatButtonClick();
                          }}
                        >
                          💡 Create Your First Idea
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-section">
                  <h4>My Friends (0)</h4>
                  <div className="profile-friends">
                    <div className="no-friends-message">
                      <p>You haven't connected with anyone yet.</p>
                      <button 
                        className="connect-friends-button"
                        onClick={() => {
                          setIsUserProfileOpen(false);
                          handleConnectClick();
                        }}
                      >
                        🌐 Find Friends
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <div className="idea-modal-overlay" onClick={closeIdeaModal}>
          <div className="idea-modal" onClick={(e) => e.stopPropagation()}>
            <div className="idea-modal-header">
              <h2>{selectedIdea.title}</h2>
              <button className="close-button" onClick={closeIdeaModal}>×</button>
            </div>
            
            <div className="idea-modal-content">
              <div className="idea-modal-author">
                <span className="author-avatar">👤</span>
                <span>by {selectedIdea.user.name}</span>
              </div>
              
              <div className="idea-modal-description">
                <h3>Description</h3>
                <p>{selectedIdea.description}</p>
              </div>
              
              <div className="idea-modal-verdict">
                <h3>AI Verdict</h3>
                <p>{selectedIdea.verdict}</p>
              </div>
              
              <div className="idea-modal-stats">
                <div className="modal-stat">
                  <span className="stat-icon">❤️</span>
                  <span>{selectedIdea.likes.length + (exampleLikes.has(selectedIdea.id) ? 1 : 0)} likes</span>
                </div>
                <div className="modal-stat">
                  <span className="stat-icon">💬</span>
                  <span>{selectedIdea.comments.length} comments</span>
                </div>
              </div>
              
              <div className="idea-modal-actions">
                <button
                  className={`modal-like-button ${exampleLikes.has(selectedIdea.id) ? 'liked' : ''}`}
                  onClick={(e) => handleLike(selectedIdea.id, e)}
                >
                  {exampleLikes.has(selectedIdea.id) ? "❤️ Liked" : "🤍 Like"}
                </button>
              </div>
              
              <div className="idea-modal-comments">
                <h3>Comments ({selectedIdea.comments.length})</h3>
                <div className="comments-list">
                  {selectedIdea.comments.map((comment) => (
                    <div key={comment.id} className="modal-comment">
                      <div className="comment-header">
                        <span className="comment-author">👤 {comment.user.name}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
