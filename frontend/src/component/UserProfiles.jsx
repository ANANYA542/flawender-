import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from './MockData';
import './UserProfiles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfiles = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState(new Set());
  const [friends, setFriends] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Use MOCK USERS when API fails
      setUsers([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = (userId) => {
    if (friendRequests.has(userId)) {
      // Cancel friend request
      setFriendRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } else if (friends.has(userId)) {
      // Remove friend
      setFriends(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } else {
      // Send friend request
      setFriendRequests(prev => new Set([...prev, userId]));
      // Simulate auto-accept for demo
      setTimeout(() => {
        setFriendRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        setFriends(prev => new Set([...prev, userId]));
      }, 1000);
    }
  };

  const handleUserClick = (clickedUser) => {
    setSelectedUser(clickedUser);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  if (!isOpen) return null;

  // Use MOCK_USERS if fetched users list is empty
  const displayUsers = users.length > 0 ? users : MOCK_USERS;

  return (
    <div className="user-profiles-overlay" onClick={onClose}>
      <div className="user-profiles-modal" onClick={(e) => e.stopPropagation()}>
        {selectedUser ? (
          // User Profile View
          <div className="user-profile-view">
            <div className="user-profiles-header">
              <button className="back-button" onClick={handleBackToList}>← Back</button>
              <h2>{selectedUser.name}'s Profile</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="profile-info">
                  <h3>{selectedUser.name}</h3>
                  <p className="profile-email">{selectedUser.email}</p>
                  <p className="profile-bio">{selectedUser.bio}</p>
                  <div className="profile-stats">
                    <span className="stat">💡 {selectedUser._count?.ideas || (selectedUser.ideas ? selectedUser.ideas.length : 0)} ideas</span>
                    <span className="stat">❤️ {selectedUser._count?.likes || 0} likes</span>
                    <span className="stat">👥 {selectedUser.friends?.length || 0} friends</span>
                  </div>
                </div>
              </div>

              <div className="profile-sections">
                <div className="profile-section">
                  <h4>Ideas ({selectedUser.ideas?.length || 0})</h4>
                  <div className="profile-ideas">
                    {selectedUser.ideas?.map((idea) => (
                      <div key={idea.id} className="profile-idea-card">
                        <h5>{idea.title}</h5>
                        <p>{idea.description}</p>
                        <div className="idea-stats">
                          <span>❤️ {idea.likes ? idea.likes.length : 0}</span>
                          <span>💬 {idea.comments ? idea.comments.length : 0}</span>
                        </div>
                      </div>
                    )) || <p>No ideas shared yet.</p>}
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Friends ({selectedUser.friends?.length || 0})</h4>
                  <div className="profile-friends">
                    {selectedUser.friends?.map((friendId) => {
                      // Attempt to find friend in the Mock Users list as a fallback lookup
                      const friend = MOCK_USERS.find(u => u.id === friendId) || { name: 'Unknown User' };
                      return (
                        <div key={friendId} className="friend-item">
                          <span className="friend-avatar">👤</span>
                          <span className="friend-name">{friend.name}</span>
                        </div>
                      );
                    }) || <p>No friends yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Users List View
          <>
            <div className="user-profiles-header">
              <h2>Connect with Users</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            
            <div className="user-profiles-content">
              {loading ? (
                <div className="loading">Loading users...</div>
              ) : (
                <div className="users-list">
                  {displayUsers.map((displayUser) => (
                    <div key={displayUser.id} className="user-card">
                      <div className="user-avatar" onClick={() => handleUserClick(displayUser)}>
                        <span className="avatar-icon">👤</span>
                      </div>
                      <div className="user-info" onClick={() => handleUserClick(displayUser)}>
                        <h3 className="user-name">{displayUser.name}</h3>
                        <p className="user-email">{displayUser.email}</p>
                        <p className="user-bio">{displayUser.bio}</p>
                        <div className="user-stats">
                          <span className="stat">💡 {displayUser._count?.ideas || (displayUser.ideas ? displayUser.ideas.length : 0)} ideas</span>
                          <span className="stat">❤️ {displayUser._count?.likes || 0} likes</span>
                        </div>
                      </div>
                      <div className="user-actions">
                        <button 
                          className={`connect-button ${
                            friends.has(displayUser.id) ? 'friends' : 
                            friendRequests.has(displayUser.id) ? 'pending' : ''
                          }`}
                          onClick={() => handleAddFriend(displayUser.id)}
                        >
                          {friends.has(displayUser.id) ? '✓ Friends' : 
                           friendRequests.has(displayUser.id) ? 'Pending...' : '+ Add Friend'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfiles;
