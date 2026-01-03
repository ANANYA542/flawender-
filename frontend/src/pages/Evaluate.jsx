import React, { useState } from 'react';
import Header from '../components/Header';
import { useBackend } from '../context/BackendContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Wand2, Lightbulb, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const Evaluate = () => {
  const [ideaInput, setIdeaInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const { addIdea } = useBackend();
  const { user } = useAuth(); // Assume we might need user context later

  const handleEvaluate = async () => {
    if (!ideaInput.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // 1. Create a dummy idea object
    const newIdea = {
        title: ideaInput.split(' ').slice(0, 5).join(' ') + '...', // Simple truncated title
        description: ideaInput,
        tags: ['New Idea', 'AI Analysis'],
        author: user ? { name: user.name, role: 'Founder', avatar: user.avatar } : { name: 'Anonymous', role: 'Vistor', avatar: 'https://ui-avatars.com/api/?name=Anonymous' }
    };

    // 2. "Call" backend to analyze and add
    const analyzedIdea = await addIdea(newIdea);
    
    // 3. Set dummy result for display
    setResult({
        ...analyzedIdea,
        positives: [
            "Scalable architecture allowing for rapid growth.",
            "Strong focus on user experience and accessibility.",
            "High potential for market disruption in its niche."
        ],
        negatives: [
            "High competition from established tech giants.",
            "Initial development costs may be significant.",
            "Dependence on third-party API reliability."
        ],
        verdict: "A promising concept with great potential if execution is flawless."
    });

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-10 transition-all">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">Validate your next big thing</h1>
                <div className="relative">
                    <input
                        type="text"
                        value={ideaInput}
                        onChange={(e) => setIdeaInput(e.target.value)}
                        placeholder="Enter your startup idea here..."
                        className="w-full pl-6 pr-40 py-5 text-lg rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all shadow-sm"
                    />
                    <button 
                        onClick={handleEvaluate}
                        disabled={isAnalyzing || !ideaInput.trim()}
                        className={`absolute right-2 top-2 bottom-2 px-6 rounded-lg font-bold text-white transition-all flex items-center
                        ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C6A66C] hover:bg-[#B3935B] shadow-lg shadow-orange-200'}`}
                    >
                        {isAnalyzing ? (
                             <span className="flex items-center"><Wand2 className="animate-spin mr-2 h-5 w-5"/> Analyzing...</span>
                        ) : (
                             "Evaluate Idea"
                        )}
                    </button>
                </div>
                <p className="mt-3 text-sm text-gray-400 ml-2">Try: "A subscription service for eco-friendly pet toys"</p>
            </div>
        </div>

        {/* Results Section */}
        {result && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
                <div className="mb-8">
                    <h2 className="text-3xl font-serif text-[#C6A66C] mb-6">Description</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        <span className="font-bold text-gray-900">{result.title.replace('...', '')}</span> {result.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                        <h3 className="flex items-center text-green-700 font-bold text-xl mb-4">
                            <CheckCircle className="mr-2 h-6 w-6" /> Positives
                        </h3>
                        <ul className="space-y-3">
                            {result.positives.map((item, i) => (
                                <li key={i} className="flex items-start text-gray-700">
                                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                        <h3 className="flex items-center text-red-700 font-bold text-xl mb-4">
                            <AlertTriangle className="mr-2 h-6 w-6" /> Negatives
                        </h3>
                        <ul className="space-y-3">
                            {result.negatives.map((item, i) => (
                                <li key={i} className="flex items-start text-gray-700">
                                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#C6A66C]">
                    <h3 className="text-[#C6A66C] font-serif text-xl mb-2">Honest Verdict Tagline</h3>
                    <p className="text-2xl font-serif italic text-gray-800">"{result.verdict}"</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Evaluate;
