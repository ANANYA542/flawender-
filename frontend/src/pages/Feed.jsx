import React, { useState } from 'react';
import Header from '../components/Header';
import { useBackend } from '../context/BackendContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ThumbsUp, MessageSquare, TrendingUp, Star, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Feed = () => {
    const { ideas, trendingTopics, toggleLike, addComment, loading } = useBackend(); // Added loading
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Newest');
    const navigate = useNavigate();
    const [expandedIdeaId, setExpandedIdeaId] = useState(null); // Track which idea has comments expanded
    const [commentText, setCommentText] = useState('');
  
    const handleLike = (e, id) => {
      e.preventDefault(); 
      e.stopPropagation();
      toggleLike(id);
    };
  
    const toggleComments = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (expandedIdeaId === id) {
            setExpandedIdeaId(null);
        } else {
            setExpandedIdeaId(id);
        }
    };
  
    const navigateToDetails = (id) => {
        navigate(`/idea/${id}`);
    };

    const handleQuickComment = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if(commentText.trim() && user) {
            addComment(id, commentText, user);
            setCommentText('');
        }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 sticky top-28">
                  <nav className="space-y-1">
                      <Link to="/feed" className="flex items-center px-4 py-3 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg">
                          <TrendingUp className="mr-3 h-5 w-5" /> Feed
                      </Link>
                      <Link to="/leaderboard" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                           <Star className="mr-3 h-5 w-5" /> Leaderboard
                      </Link>
                      <Link to="/community" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                          <MessageSquare className="mr-3 h-5 w-5" /> Discussions
                      </Link>
                  </nav>
              </div>
            </div>
  
            {/* Main Feed */}
            <div className="flex-1">
              <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Startup Ideas Feed</h1>
                  <p className="text-gray-500 text-sm">Discover AI-evaluated opportunities and join the discussion.</p>
              </div>
  
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 mb-6 inline-flex overflow-hidden">
                  {['Newest', 'Top AI Rated', 'Trending', 'Following'].map((tab) => (
                      <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>

              {/* Loading State */}
              {loading && <div className="p-8 text-center text-gray-500">Loading ideas...</div>}
              
              {/* Ideas List */}
              <div className="space-y-6">
                  {!loading && ideas.map((idea) => (
                      <div 
                          key={idea.id} 
                          onClick={() => navigateToDetails(idea.id)}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group"
                      >
                          <div className="flex justify-between items-start mb-4">
                              <Link to={`/profile/${idea.author.name}`} className="flex items-center space-x-3 group" onClick={(e) => e.stopPropagation()}>
                                  <img src={idea.author.avatar} alt={idea.author.name} className="h-10 w-10 rounded-full border border-gray-200" />
                                  <div>
                                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{idea.author.name}</h3>
                                      <p className="text-xs text-gray-500">{idea.author.role} • {idea.postedAt}</p>
                                  </div>
                              </Link>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1
                                  ${idea.score >= 90 ? 'bg-green-50 text-green-700 border-green-200' : 
                                    idea.score >= 80 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                  <span>{idea.score}/100</span>
                                  <span className="hidden sm:inline">- {idea.status}</span>
                              </div>
                          </div>
  
                          <div className="flex items-start space-x-4">
                             <div className="h-16 w-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl shadow-inner">
                                  💡
                             </div>
                             <div>
                                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{idea.title}</h2>
                                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                      {idea.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                      {idea.tags.map(tag => (
                                          <span key={tag} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">#{tag}</span>
                                      ))}
                                  </div>
                             </div>
                          </div>
  
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                              <div className="flex space-x-6">
                                  <button 
                                      onClick={(e) => handleLike(e, idea.id)}
                                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors hover:bg-red-50 px-2 py-1 rounded-md"
                                  >
                                      <ThumbsUp className={`h-4 w-4 ${idea.likes > 0 ? 'fill-current' : ''}`} /> <span>{idea.likes}</span>
                                  </button>
                                  <button 
                                      onClick={(e) => toggleComments(e, idea.id)}
                                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors hover:bg-blue-50 px-2 py-1 rounded-md"
                                  >
                                      <MessageSquare className="h-4 w-4" /> <span>{idea.comments?.length || 0}</span>
                                  </button>
                              </div>
                              <span className="text-blue-600 text-sm font-medium group-hover:underline">
                                  View Details &rarr;
                              </span>
                          </div>

                          {/* Inline Comments Section */}
                          {expandedIdeaId === idea.id && (
                              <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                      {idea.comments && idea.comments.length > 0 ? (
                                          idea.comments.map(c => (
                                              <div key={c.id} className="flex space-x-3 text-sm">
                                                  <img src={c.avatar} className="w-6 h-6 rounded-full" />
                                                  <div className="bg-gray-50 p-2 rounded-lg flex-1">
                                                      <span className="font-bold text-gray-800 mr-2">{c.author}</span>
                                                      <span className="text-gray-600">{c.text}</span>
                                                  </div>
                                              </div>
                                          ))
                                      ) : <p className="text-xs text-gray-400">No comments yet.</p>}
                                  </div>
                                  
                                  {user && (
                                      <div className="flex gap-2">
                                          <input 
                                              type="text" 
                                              placeholder="Write a comment..." 
                                              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                                              value={commentText}
                                              onChange={(e) => setCommentText(e.target.value)}
                                              onKeyDown={(e) => {
                                                  if(e.key === 'Enter') handleQuickComment(e, idea.id);
                                              }}
                                          />
                                          <button 
                                              onClick={(e) => handleQuickComment(e, idea.id)}
                                              disabled={!commentText.trim()}
                                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold disabled:opacity-50"
                                          >Post</button>
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
            </div>
  
            {/* Right Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0 space-y-6 hidden lg:block">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-28">
                  <div className="flex items-center mb-4 text-blue-600 space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <h3 className="font-bold text-gray-900">Trending Topics</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {trendingTopics.map(topic => (
                          <span key={topic} className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                              {topic}
                          </span>
                      ))}
                  </div>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    );
  };
  
  export default Feed;
