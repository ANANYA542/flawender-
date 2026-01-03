import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useBackend } from '../context/BackendContext';
import { useAuth } from '../context/AuthContext';
import { Link, CheckCircle, MapPin, Link as LinkIcon, Calendar, Twitter, Github, Edit3 } from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams(); // Can be ID or Name
  const { getUserProfile, followedUsers, toggleFollow } = useBackend();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchedProfile = getUserProfile(userId);
    setProfile(fetchedProfile);
  }, [userId, getUserProfile]);

  if (!profile) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  const isFollowing = followedUsers.includes(profile.id);
  const isMe = currentUser?.id === profile.id || currentUser?.name === profile.name;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
                    {/* Cover Photo */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    
                    <div className="px-6 pb-6 relative">
                        {/* Avatar */}
                        <div className="absolute -top-16 left-6">
                            <img src={profile.avatar} alt={profile.name} className="h-32 w-32 rounded-full border-4 border-white shadow-md bg-white" />
                        </div>
                        
                        <div className="mt-20">
                            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                            <p className="text-blue-600 font-medium text-sm mb-4">@{profile.name.toLowerCase().replace(' ', '')}</p>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{profile.bio}</p>
                            
                            {isMe ? (
                                <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center shadow-lg shadow-blue-200">
                                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                                </button>
                            ) : (
                                <button 
                                    onClick={() => toggleFollow(profile.id)}
                                    className={`w-full font-bold py-2 px-4 rounded-xl transition-colors flex justify-center items-center shadow-sm box-border border
                                    ${isFollowing 
                                        ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
                                        : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-blue-200'}`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                            
                            <hr className="my-6 border-gray-100" />
                            
                            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                <div>
                                    <div className="font-bold text-xl text-gray-900">12</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wide">Ideas</div>
                                </div>
                                <div>
                                    <div className="font-bold text-xl text-gray-900">450</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wide">Rep</div>
                                </div>
                                <div>
                                    <div className="font-bold text-xl text-gray-900">{profile.followers}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wide">Followers</div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900 mb-2">Interests</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.expertise.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">{tag}</span>
                                        ))}
                                        {profile.expertise.length === 0 && <span className="text-xs text-gray-400 italic">No interests listed</span>}
                                    </div>
                                </div>
                                
                                <div className="flex space-x-4 justify-center pt-2">
                                     <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                                        <LinkIcon className="h-5 w-5" />
                                     </div>
                                      <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                                        <Twitter className="h-5 w-5" />
                                     </div>
                                      <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-colors">
                                        <Github className="h-5 w-5" />
                                     </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Content Tabs */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 pt-4 flex space-x-8 overflow-x-auto">
                    {['My Ideas', 'Comments', 'Liked', 'Saved'].map((tab, i) => (
                        <button key={tab} className={`pb-4 text-sm font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap ${i === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            <span>{tab}</span>
                            {i === 0 && <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">12</span>}
                        </button>
                    ))}
                </div>

                {/* Content Area (Placeholder for Idea Cards logic re-use) */}
                <div className="bg-white rounded-b-xl border border-gray-100 border-t-0 p-6 min-h-[500px] flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <div className="text-4xl mb-4">✨</div>
                        <p>User ideas and activity will appear here.</p>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
