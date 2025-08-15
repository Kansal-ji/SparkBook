import React from 'react';
import { Camera, Users, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../context/AuthContext';
import Post from './Post';
import { Link } from 'react-router-dom';

const Feed: React.FC = () => {
  const { posts, loading } = usePosts();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 max-w-md mx-auto">
          <div className="relative mb-6">
            <Camera className="h-20 w-20 text-gray-300 mx-auto" />
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to SparkBook!</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Start your journey by sharing your first moment. Connect with friends and discover amazing content.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Camera className="h-5 w-5 mr-2" />
            Create Your First Post
            <Sparkles className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 mb-6 shadow-lg">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <div className="flex-shrink-0 text-center group cursor-pointer">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg group-hover:scale-105 transition-transform">
                {user?.username[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <Camera className="h-3 w-3 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Your story</span>
          </div>
          
          {/* Sample stories */}
          {[
            { name: 'alex_photo', color: 'from-pink-500 to-rose-500' },
            { name: 'sarah_jane', color: 'from-purple-500 to-indigo-500' },
            { name: 'travel_diaries', color: 'from-green-500 to-teal-500' },
            { name: 'food_lover', color: 'from-orange-500 to-red-500' },
            { name: 'nature_shots', color: 'from-cyan-500 to-blue-500' }
          ].map((story, i) => (
            <div key={i} className="flex-shrink-0 text-center group cursor-pointer">
              <div className={`w-16 h-16 bg-gradient-to-br ${story.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg group-hover:scale-105 transition-transform ring-2 ring-white ring-offset-2`}>
                {story.name[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-600 font-medium">{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div 
            key={post.id}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
            className="animate-fade-in-up"
          >
            <Post post={post} />
          </div>
        ))}
      </div>

      {/* Sidebar suggestions - Hidden on mobile, shown on larger screens */}
      <div className="hidden xl:block fixed right-8 top-24 w-80">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Suggestions for you</h3>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'photo_enthusiast', followers: '2.1k', mutual: '5 mutual friends' },
              { name: 'creative_minds', followers: '1.8k', mutual: '3 mutual friends' },
              { name: 'art_gallery', followers: '3.2k', mutual: '8 mutual friends' }
            ].map((suggestion, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 transition-transform">
                    {suggestion.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{suggestion.name}</p>
                    <p className="text-xs text-gray-500">{suggestion.followers} followers</p>
                    <p className="text-xs text-blue-600">{suggestion.mutual}</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg mt-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
            Trending
          </h3>
          <div className="space-y-2">
            {['#photography', '#travel', '#foodie', '#nature', '#art'].map((tag, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium hover:underline cursor-pointer">{tag}</span>
                <span className="text-gray-500">{Math.floor(Math.random() * 50) + 10}k posts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default Feed;