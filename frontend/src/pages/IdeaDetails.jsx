import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useBackend } from '../context/BackendContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Tag, Calendar, User, Send } from 'lucide-react';

const IdeaDetails = () => {
  const { id } = useParams();
  const { getIdea, toggleLike, addComment } = useBackend();
  const { user: currentUser } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // Re-fetch logic or just reliance on backend context state which might update (simpler for now to just re-get)
    const fetchedIdea = getIdea(id);
    setIdea(fetchedIdea);
    setLoading(false);
  }, [id, getIdea, idea]); // Depend on idea to re-render when local state would update if we had real subscription

  const handleLike = () => {
      toggleLike(id);
      // Optimistic update handled by context in this simple mock
      // But we forced re-render via effect dependency or local state usually
  }

  const handleAddComment = () => {
      if(!commentText.trim()) return;
      addComment(id, commentText, currentUser);
      setCommentText('');
      // Force refresh of local idea state from context
      setIdea(getIdea(id)); 
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (!idea) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Idea not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/feed" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                         <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border mb-4
                            ${idea.score >= 90 ? 'bg-green-50 text-green-700 border-green-200' : 
                              idea.score >= 80 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            {idea.status} • {idea.score}/100 AI Score
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{idea.title}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <img src={idea.author.avatar} alt={idea.author.name} className="h-8 w-8 rounded-full" />
                                <span className="text-gray-700 font-medium">{idea.author.name}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 text-sm flex items-center"><Calendar className="h-4 w-4 mr-1"/> {idea.postedAt}</span>
                        </div>
                    </div>
                     <div className="h-16 w-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                        💡
                    </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-8">
                    {idea.markdown ? (
                        // Basic markdown rendering for demo (real implementation would use react-markdown)
                        idea.markdown.split('\n').map((line, i) => {
                             if(line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>
                             if(line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
                             return <p key={i} className="mb-2">{line}</p>
                        })
                    ) : (
                        <p>{idea.description}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {idea.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                            <Tag className="mr-1.5 h-3 w-3" /> {tag}
                        </span>
                    ))}
                </div>

                 <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                    <button 
                        onClick={handleLike}
                        className="flex items-center space-x-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-500 px-4 py-2 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
                    >
                        <ThumbsUp className={`h-5 w-5 ${idea.likes > 0 ? 'fill-current' : ''}`} />
                        <span className="font-medium">{idea.likes} Likes</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">{idea.comments?.length || 0} Comments</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Evaluation Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Evaluation Breakdown</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Desirability</span>
                    <div className="mt-2 text-2xl font-bold text-blue-600">8.5/10</div>
                </div>
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Feasibility</span>
                    <div className="mt-2 text-2xl font-bold text-green-600">9.2/10</div>
                </div>
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Viability</span>
                    <div className="mt-2 text-2xl font-bold text-yellow-600">7.8/10</div>
                </div>
            </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({idea.comments?.length || 0})</h3>
            
            {/* Comment Input */}
            <div className="flex items-start space-x-4 mb-8">
                {currentUser ? (
                    <>
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full border border-gray-200" />
                    <div className="flex-1">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add to the discussion..."
                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 min-h-[100px] resize-y"
                        />
                        <div className="mt-2 flex justify-end">
                            <button 
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <Send className="h-4 w-4 mr-2" /> Post Comment
                            </button>
                        </div>
                    </div>
                    </>
                ) : (
                     <div className="w-full bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-gray-600">Please <Link to="/login" className="text-blue-600 font-bold hover:underline">login</Link> to join the discussion.</p>
                     </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {idea.comments && idea.comments.length > 0 ? (
                    idea.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-4">
                            <img src={comment.avatar} alt={comment.author} className="h-10 w-10 rounded-full border border-gray-200" />
                            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-900">{comment.author}</h4>
                                    <span className="text-xs text-gray-400">{comment.time}</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default IdeaDetails;
