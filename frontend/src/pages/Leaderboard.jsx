import React from 'react';
import Header from '../components/Header';
import { useBackend } from '../context/BackendContext';
import { Crown, Trophy, TrendingUp, Medal } from 'lucide-react';

const Leaderboard = () => {
  const { ideas } = useBackend();
  // Sort ideas by score
  const sortedIdeas = [...ideas].sort((a, b) => b.score - a.score);
  const topThree = sortedIdeas.slice(0, 3);
  const restOfList = sortedIdeas.slice(3, 10); // Show top 10

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
             <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Top Rated Ideas</h1>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the most innovative concepts validated by our community. These are the ideas that have resonated the most with evaluators and founders alike.</p>
        </div>

        {/* Podium Section */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full md:w-80 flex flex-col items-center relative mt-8 md:mt-0 transform hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 shadow-sm">2</div>
                <img src={topThree[1]?.author.avatar} className="w-16 h-16 rounded-full mb-4 border-2 border-gray-100" />
                <h3 className="font-bold text-lg text-gray-900 text-center mb-1">{topThree[1]?.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{topThree[1]?.author.name}</p>
                <div className="w-full bg-blue-50 rounded-lg py-2 px-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">{topThree[1]?.tags[0]}</span>
                    <div className="flex items-center text-red-500 font-bold">♥ {topThree[1]?.likes}</div>
                </div>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 bg-white rounded-2xl shadow-lg border-2 border-yellow-100 p-8 w-full md:w-96 flex flex-col items-center relative z-10 transform hover:-translate-y-2 transition-transform">
                <div className="absolute -top-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg text-white">
                    <Crown className="w-6 h-6" />
                </div>
                <img src={topThree[0]?.author.avatar} className="w-24 h-24 rounded-full mb-4 border-4 border-yellow-50" />
                <h3 className="font-bold text-xl text-gray-900 text-center mb-1">{topThree[0]?.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{topThree[0]?.author.name}</p>
                <div className="w-full bg-yellow-50 rounded-xl py-3 px-6 flex justify-between items-center">
                    <span className="text-xs font-bold text-yellow-800 uppercase bg-yellow-100 px-2 py-0.5 rounded">{topThree[0]?.tags[0]}</span>
                    <div className="flex items-center text-red-500 font-bold text-lg">♥ {topThree[0]?.likes}</div>
                </div>
                 <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-gray-500">AI Score</span>
                    <div className="text-3xl font-extrabold text-gray-900">{topThree[0]?.score}</div>
                </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 md:order-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full md:w-80 flex flex-col items-center relative mt-8 md:mt-0 transform hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-700 shadow-sm">3</div>
                 <img src={topThree[2]?.author.avatar} className="w-16 h-16 rounded-full mb-4 border-2 border-gray-100" />
                <h3 className="font-bold text-lg text-gray-900 text-center mb-1">{topThree[2]?.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{topThree[2]?.author.name}</p>
                <div className="w-full bg-orange-50 rounded-lg py-2 px-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-orange-700 uppercase bg-orange-100 px-2 py-0.5 rounded">{topThree[2]?.tags[0]}</span>
                    <div className="flex items-center text-red-500 font-bold">♥ {topThree[2]?.likes}</div>
                </div>
            </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-6">Idea & Description</div>
                <div className="col-span-3">Creator</div>
                <div className="col-span-2 text-right">Likes</div>
            </div>
            {restOfList.map((idea, index) => (
                <div key={idea.id} className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 text-center font-bold text-blue-600">0{index + 4}</div>
                    <div className="col-span-6">
                        <h4 className="font-bold text-gray-900">{idea.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{idea.description}</p>
                    </div>
                    <div className="col-span-3 flex items-center space-x-3">
                         <img src={idea.author.avatar} className="w-8 h-8 rounded-full" />
                         <span className="text-sm font-medium text-gray-700">{idea.author.name}</span>
                    </div>
                    <div className="col-span-2 text-right font-bold text-red-500">♥ {idea.likes}</div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
