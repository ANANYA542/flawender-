import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/ideas/leaderboard?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      setIdeas(data.ideas || []);
      setError(null);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError('Failed to load leaderboard');
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h1>🏆 Leaderboard</h1>
        </div>
        <div className="loading-message">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <button className="back-button" onClick={handleBackToHome}>
          ← Back to Home
        </button>
        <h1>🏆 Leaderboard</h1>
        <p className="leaderboard-subtitle">Most Liked Ideas</p>
      </div>

      <div className="period-selector">
        <button 
          className={`period-button ${period === 'all' ? 'active' : ''}`}
          onClick={() => setPeriod('all')}
        >
          All Time
        </button>
        <button 
          className={`period-button ${period === 'month' ? 'active' : ''}`}
          onClick={() => setPeriod('month')}
        >
          This Month
        </button>
        <button 
          className={`period-button ${period === 'week' ? 'active' : ''}`}
          onClick={() => setPeriod('week')}
        >
          This Week
        </button>
      </div>

      <div className="leaderboard-content">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button className="retry-button" onClick={fetchLeaderboard}>
              Try Again
            </button>
          </div>
        ) : ideas.length === 0 ? (
          <div className="no-ideas-message">
            <h3>No ideas found</h3>
            <p>Be the first to share an idea and claim the top spot!</p>
            <button className="create-idea-button" onClick={() => navigate('/chat')}>
              💡 Create Your First Idea
            </button>
          </div>
        ) : (
          <div className="leaderboard-list">
            {ideas.map((idea, index) => (
              <div key={idea.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
                <div className="rank-section">
                  <span className="rank-icon">{getRankIcon(index)}</span>
                </div>
                
                <div className="idea-content">
                  <h3 className="idea-title">{idea.title}</h3>
                  <p className="idea-description">{idea.description}</p>
                  <div className="idea-verdict">
                    <strong>AI Verdict:</strong> {idea.verdict}
                  </div>
                  
                  <div className="idea-meta">
                    <span className="idea-author">by {idea.user.name}</span>
                    <span className="idea-date">{formatDate(idea.createdAt)}</span>
                  </div>
                </div>
                
                <div className="stats-section">
                  <div className="stat-item likes">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-count">{idea.likes.length}</span>
                    <span className="stat-label">likes</span>
                  </div>
                  <div className="stat-item comments">
                    <span className="stat-icon">💬</span>
                    <span className="stat-count">{idea.comments.length}</span>
                    <span className="stat-label">comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
