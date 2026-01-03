import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
      logout();
      setDropdownOpen(false);
      navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-[100] border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Flawender</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How it Works</Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Leaderboard</Link>
            <Link to="/community" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Community</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full border border-gray-200" />
                        <span className="hidden md:block font-medium text-gray-700 text-sm">{user.name}</span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                            <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                                <User className="h-4 w-4 mr-2" /> Your Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                                <LogOut className="h-4 w-4 mr-2" /> Sign out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                    <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                    Get Started
                    </Link>
                </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
