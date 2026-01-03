import React, { useState } from 'react';
import Header from '../components/Header';
import { useBackend } from '../context/BackendContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Users, TrendingUp, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Community = () => {
    const { communityThreads, trendingTopics, addThread, toggleThreadLike } = useBackend();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState('');
  
    const handleStartDiscussion = () => {
        if (!user) {
            alert('Please login to start a discussion.');
            return;
        }
        setIsModalOpen(true);
    };
  
    const handleSubmitThread = (e) => {
        e.preventDefault();
        if (newThreadTitle.trim()) {
            addThread(newThreadTitle, user);
            setIsModalOpen(false);
            setNewThreadTitle('');
        }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <Header />
        
        {/* Discussion Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4">Start a Discussion</h2>
                    <textarea 
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        placeholder="What's on your mind? Ask for feedback, share an insight..."
                        className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-100 mb-4"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button 
                            onClick={handleSubmitThread}
                            disabled={!newThreadTitle.trim()}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Post Discussion
                        </button>
                    </div>
                </div>
            </div>
        )}
  
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">Community Discussions</h1>
                      <button 
                          onClick={handleStartDiscussion}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center shadow-lg shadow-blue-200"
                      >
                          <Plus className="h-4 w-4 mr-2"/> Start Discussion
                      </button>
                  </div>
                  <p className="text-gray-500 mb-6">Share your startup ideas, get AI feedback, and connect with founders.</p>
  
                  {/* Filter Tabs */}
                  <div className="flex space-x-6 border-b border-gray-200 mb-6">
                      {['Trending', 'Newest', 'Top Rated'].map((tab, i) => (
                          <button key={tab} className={`pb-3 text-sm font-medium border-b-2 ${i === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                              {tab}
                          </button>
                      ))}
                  </div>
  
                  {/* Threads */}
                  <div className="space-y-4">
                      {communityThreads.map((thread) => (
                           <div key={thread.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                              <div className="flex items-start justify-between">
                                  <Link to={`/profile/${thread.author}`} className="flex items-center space-x-3 mb-3 hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                      <img src={thread.avatar} className="w-10 h-10 rounded-full" />
                                      <div>
                                          <div className="flex items-center space-x-2">
                                              <span className="font-bold text-gray-900 text-sm">{thread.author}</span>
                                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{thread.score ? `Score: ${thread.score}` : 'Member'}</span>
                                          </div>
                                          <span className="text-xs text-gray-500">{thread.time} • {thread.role}</span>
                                      </div>
                                  </Link>
                              </div>
                              
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{thread.title}</h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">I'm building an app that uses computer vision to identify plant diseases...</p>
                              
                              <div className="flex items-center justify-between">
                                  <div className="flex space-x-2">
                                      {(thread.tags || []).map(tag => (
                                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">#{tag}</span>
                                      ))}
                                  </div>
                                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); toggleThreadLike(thread.id); }}
                                          className="flex items-center hover:text-blue-600 transition-colors"
                                      >
                                          <TrendingUp className={`h-4 w-4 mr-1 ${thread.likes > 0 ? 'text-blue-600' : ''}`} /> {thread.likes}
                                      </button>
                                      <button className="flex items-center hover:text-blue-600 transition-colors">
                                          <MessageSquare className="h-4 w-4 mr-1"/> {thread.comments} Comments
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
  
              {/* Sidebar */}
              <div className="space-y-6 hidden lg:block">
                   <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-28">
                      <h3 className="font-bold text-gray-900 mb-4">Trending Topics</h3>
                      <div className="space-y-4">
                          {[{name: '#GenerativeAI', posts: '2.4k'}, {name: '#SaaS', posts: '1.8k'}, {name: '#NoCode', posts: '950'}].map(topic => (
                              <div key={topic.name} className="flex justify-between items-center group cursor-pointer">
                                  <div>
                                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{topic.name}</p>
                                      <p className="text-xs text-gray-500">{topic.posts} posts</p>
                                  </div>
                                  <TrendingUp className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                              </div>
                          ))}
                      </div>
                   </div>
  
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-[420px]">
                      <h3 className="font-bold text-gray-900 mb-4">Top Contributors</h3>
                      <div className="space-y-4">
                          {[{name: 'Mike Ross', score: '15k', id: '101'}, {name: 'Anna Lee', score: '12k', id: '102'}, {name: 'James D.', score: '9k', id: '103'}].map((user, i) => (
                               <div key={i} className="flex items-center justify-between">
                                  <Link to={`/profile/${user.name}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                      <img src={`https://ui-avatars.com/api/?name=${user.name}`} className="w-10 h-10 rounded-full" />
                                      <div>
                                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                          <p className="text-xs text-gray-500">{user.score} Reputation</p>
                                      </div>
                                  </Link>
                                  <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100">Follow</button>
                              </div>
                          ))}
                      </div>
                    </div>
              </div>
  
          </div>
        </div>
      </div>
    );
  };
  
  export default Community;
