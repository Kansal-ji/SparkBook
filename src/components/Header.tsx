import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, PlusSquare, User, Heart, LogOut, Sparkles, MessageSquare, Newspaper, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { searchUsers } = useUsers();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchUsers(query);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home', gradient: 'from-blue-500 to-blue-600' },
    { icon: PlusSquare, path: '/create', label: 'Create', gradient: 'from-purple-500 to-purple-600' },
    { icon: Newspaper, path: '/news', label: 'News', gradient: 'from-orange-500 to-red-500' },
    { icon: MessageSquare, path: '/messages', label: 'Messages', gradient: 'from-green-500 to-teal-500' },
    { icon: Heart, path: '/activity', label: 'Activity', gradient: 'from-pink-500 to-red-500' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SparkBook
              </span>
              <Sparkles className="inline h-4 w-4 text-yellow-400 ml-1 animate-pulse" />
            </div>
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-200 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              />
            </div>
            
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-2xl mt-2 max-h-64 overflow-y-auto animate-slide-down">
                {searchResults.map((searchUser) => (
                  <Link
                    key={searchUser.id}
                    to={`/profile/${searchUser.id}`}
                    className="flex items-center p-4 hover:bg-gray-50/80 transition-colors border-b border-gray-100/50 last:border-b-0"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {searchUser.username[0].toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">{searchUser.username}</p>
                      <p className="text-sm text-gray-500">{searchUser.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {navItems.map(({ icon: Icon, path, label, gradient }) => (
              <Link
                key={path}
                to={path}
                className={`relative p-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === path
                    ? 'bg-gradient-to-r ' + gradient + ' text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100/80'
                }`}
                title={label}
              >
                <Icon className="h-5 w-5" />
                {location.pathname === path && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl"></div>
                )}
              </Link>
            ))}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/profile'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100/80'
                }`}
                title="Profile"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username[0].toUpperCase()}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-2xl py-2 animate-slide-down">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50/80 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    My Profile
                  </Link>
                  <hr className="my-2 border-gray-200/50" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50/80 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;