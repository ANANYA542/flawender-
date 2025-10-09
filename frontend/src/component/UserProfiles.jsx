import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./UserProfiles.css";

const API_BASE_URL = "http://localhost:4000/api";

const UserProfiles = ({ isOpen, onClose }) => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState(new Set());
  const [friends, setFriends] = useState(new Set());

  // Example users with detailed profiles
  const exampleUsers = [
    {
      id: 'example-user-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      bio: 'AI enthusiast and fitness tech innovator. Building the future of personalized health.',
      createdAt: new Date('2024-01-10T00:00:00Z'),
      _count: { ideas: 3, likes: 12, comments: 8 },
      ideas: [
        {
          id: 'sarah-idea-1',
          title: 'AI-Powered Fitness Coach',
          description: 'A mobile app that uses AI to create personalized workout plans based on your fitness level, goals, and available equipment.',
          verdict: 'Promising concept with strong market potential in the growing fitness tech sector.',
          likes: 15,
          comments: 6
        },
        {
          id: 'sarah-idea-2',
          title: 'Smart Nutrition Tracker',
          description: 'An app that uses computer vision to identify food and automatically track nutritional intake.',
          verdict: 'Innovative approach to nutrition tracking with good commercial viability.',
          likes: 8,
          comments: 3
        }
      ],
      friends: ['example-user-2', 'example-user-3', 'example-user-5']
    },
    {
      id: 'example-user-2',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      bio: 'Full-stack developer passionate about creating solutions that make a difference.',
      createdAt: new Date('2024-01-08T00:00:00Z'),
      _count: { ideas: 2, likes: 18, comments: 12 },
      ideas: [
        {
          id: 'mike-idea-1',
          title: 'Code Review Assistant',
          description: 'An AI tool that provides intelligent code review suggestions and best practices.',
          verdict: 'Strong technical concept with clear market demand in developer tools.',
          likes: 22,
          comments: 9
        }
      ],
      friends: ['example-user-1', 'example-user-4', 'example-user-7']
    },
    {
      id: 'example-user-3',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      bio: 'UX designer and entrepreneur focused on sustainable technology solutions.',
      createdAt: new Date('2024-01-12T00:00:00Z'),
      _count: { ideas: 4, likes: 25, comments: 15 },
      ideas: [
        {
          id: 'emma-idea-1',
          title: 'Eco-Friendly Shopping Assistant',
          description: 'A browser extension that suggests sustainable alternatives while online shopping.',
          verdict: 'Timely concept addressing growing environmental consciousness.',
          likes: 18,
          comments: 7
        },
        {
          id: 'emma-idea-2',
          title: 'Carbon Footprint Tracker',
          description: 'Personal app to track and reduce daily carbon footprint with gamification.',
          verdict: 'Good social impact potential with monetization opportunities.',
          likes: 14,
          comments: 5
        }
      ],
      friends: ['example-user-1', 'example-user-6', 'example-user-8']
    },
    {
      id: 'example-user-4',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@example.com',
      bio: 'Data scientist and machine learning engineer exploring innovative applications.',
      createdAt: new Date('2024-01-05T00:00:00Z'),
      _count: { ideas: 1, likes: 9, comments: 4 },
      ideas: [
        {
          id: 'alex-idea-1',
          title: 'Predictive Maintenance Platform',
          description: 'IoT-based system for predicting equipment failures in manufacturing.',
          verdict: 'Strong B2B opportunity with proven market demand.',
          likes: 11,
          comments: 4
        }
      ],
      friends: ['example-user-2', 'example-user-9']
    },
    {
      id: 'example-user-5',
      name: 'David Park',
      email: 'david.park@example.com',
      bio: 'IoT specialist and smart home enthusiast. Making everyday life more intelligent.',
      createdAt: new Date('2024-01-15T00:00:00Z'),
      _count: { ideas: 2, likes: 14, comments: 8 },
      ideas: [
        {
          id: 'david-idea-1',
          title: 'Smart Plant Care System',
          description: 'An IoT device that monitors soil moisture, light levels, and temperature for houseplants.',
          verdict: 'Solid niche market opportunity with potential for subscription-based plant care services.',
          likes: 16,
          comments: 6
        }
      ],
      friends: ['example-user-1', 'example-user-6']
    }
  ];

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
      // Use example users when API fails
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

  const displayUsers = users.length > 0 ? users : exampleUsers;

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
                    <span className="stat">💡 {selectedUser._count?.ideas || 0} ideas</span>
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
                          <span>❤️ {idea.likes}</span>
                          <span>💬 {idea.comments}</span>
                        </div>
                      </div>
                    )) || <p>No ideas shared yet.</p>}
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Friends ({selectedUser.friends?.length || 0})</h4>
                  <div className="profile-friends">
                    {selectedUser.friends?.map((friendId) => {
                      const friend = exampleUsers.find(u => u.id === friendId);
                      return friend ? (
                        <div key={friendId} className="friend-item">
                          <span className="friend-avatar">👤</span>
                          <span className="friend-name">{friend.name}</span>
                        </div>
                      ) : null;
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
                          <span className="stat">💡 {displayUser._count?.ideas || 0} ideas</span>
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
