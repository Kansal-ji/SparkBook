import React from 'react';
import { Heart, MessageCircle, UserPlus, Camera, Sparkles, TrendingUp } from 'lucide-react';

const Activity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'like',
      user: 'sarah_jane',
      action: 'liked your photo',
      time: '2m',
      image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 2,
      type: 'comment',
      user: 'alex_photo',
      action: 'commented: "Amazing shot! 📸"',
      time: '5m',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 3,
      type: 'follow',
      user: 'travel_diaries',
      action: 'started following you',
      time: '1h',
    },
    {
      id: 4,
      type: 'like',
      user: 'photo_enthusiast',
      action: 'liked your photo',
      time: '2h',
      image: 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 5,
      type: 'comment',
      user: 'nature_lover',
      action: 'commented: "Beautiful colors! 🌅"',
      time: '3h',
      image: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 6,
      type: 'like',
      user: 'creative_minds',
      action: 'liked your photo',
      time: '5h',
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      default:
        return <Camera className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityGradient = (type: string) => {
    switch (type) {
      case 'like':
        return 'from-red-500 to-pink-500';
      case 'comment':
        return 'from-blue-500 to-cyan-500';
      case 'follow':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Activity</h2>
                <p className="text-sm text-gray-600">See what's happening</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>Live updates</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100/50">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="p-4 hover:bg-gray-50/50 transition-all duration-200 group animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className={`w-12 h-12 bg-gradient-to-br ${getActivityGradient(activity.type)} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-transform`}>
                  {activity.user[0].toUpperCase()}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="p-1 bg-white rounded-full shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">{activity.user}</span>{' '}
                      <span className="text-gray-700">{activity.action}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.type === 'like' && (
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs text-yellow-600">+1 engagement</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Image or Action Button */}
                {activity.image ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                    <img
                      src={activity.image}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : activity.type === 'follow' ? (
                  <button className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md">
                    Follow Back
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mx-6">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-500 mb-6">When people interact with your posts, you'll see it here.</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Sparkles className="h-4 w-4" />
                <span>Start engaging to see more activity</span>
              </div>
            </div>
          </div>
        )}

        {/* Activity Stats */}
        <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-t border-gray-200/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="group cursor-pointer">
              <div className="text-lg font-bold text-gray-900 group-hover:text-red-500 transition-colors">
                {activities.filter(a => a.type === 'like').length}
              </div>
              <div className="text-xs text-gray-500">Likes today</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-lg font-bold text-gray-900 group-hover:text-blue-500 transition-colors">
                {activities.filter(a => a.type === 'comment').length}
              </div>
              <div className="text-xs text-gray-500">Comments today</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-lg font-bold text-gray-900 group-hover:text-green-500 transition-colors">
                {activities.filter(a => a.type === 'follow').length}
              </div>
              <div className="text-xs text-gray-500">New followers</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default Activity;