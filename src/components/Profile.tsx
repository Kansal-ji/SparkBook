import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Settings, UserPlus, UserMinus, Heart, MessageCircle, Edit3, Save, X, Share, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { usePosts } from '../hooks/usePosts';
import { usersAPI } from '../services/api';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const { followUser } = useUsers();
  const { getUserPosts } = usePosts();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: '', username: '' });
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    loadProfileData();
  }, [userId, currentUser]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
        setEditData({
          bio: currentUser.bio || '',
          username: currentUser.username || ''
        });
      } else if (userId) {
        const { getUserById } = useUsers();
        const user = await getUserById(userId);
        setProfileUser(user);
      }

      // Load user posts
      const targetUserId = userId || currentUser?.id;
      if (targetUserId) {
        const posts = await getUserPosts(targetUserId);
        setUserPosts(posts);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (currentUser && profileUser && !isOwnProfile) {
      await followUser(currentUser.id, profileUser.id);
      // Reload profile to get updated follower count
      await loadProfileData();
    }
  };

  const handleSaveProfile = async () => {
    if (currentUser && isOwnProfile) {
      try {
        await usersAPI.updateProfile(editData);
        await updateUser(editData);
        setIsEditing(false);
        await loadProfileData();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileUser?.username} on SparkBook`,
          text: `Check out ${profileUser?.username}'s profile on SparkBook!`,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        setShowShareModal(true);
        setTimeout(() => setShowShareModal(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-500">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isFollowing = currentUser && profileUser ? 
    currentUser.following.includes(profileUser.id) : false;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-6 md:mb-0 relative group">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto md:mx-0 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
              {profileUser.username[0].toUpperCase()}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              {isEditing ? (
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="text-2xl font-light text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl font-light text-gray-900 mb-2 md:mb-0">
                  {profileUser.username}
                </h1>
              )}
              
              <div className="flex items-center justify-center md:justify-start space-x-2">
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 inline mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 inline mr-2" />
                        Follow
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-8 mb-4">
              <div className="text-center group cursor-pointer">
                <span className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{userPosts.length}</span>
                <span className="text-gray-500 ml-1 text-sm">posts</span>
              </div>
              <div className="text-center group cursor-pointer">
                <span className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{profileUser.followers.length}</span>
                <span className="text-gray-500 ml-1 text-sm">followers</span>
              </div>
              <div className="text-center group cursor-pointer">
                <span className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{profileUser.following.length}</span>
                <span className="text-gray-500 ml-1 text-sm">following</span>
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Write something about yourself..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            ) : (
              profileUser.bio && (
                <p className="text-gray-700 leading-relaxed">{profileUser.bio}</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Grid className="h-4 w-4 inline mr-2" />
            POSTS
          </button>
        </nav>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="relative aspect-square group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-5 w-5" />
                    <span className="font-semibold">{post.likes.length}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-semibold">{post.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12">
              <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-light text-gray-900 mb-2">No posts yet</h3>
              {isOwnProfile ? (
                <p className="text-gray-500 mb-6">Share your first photo to get started!</p>
              ) : (
                <p className="text-gray-500">This user hasn't shared any posts yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Link Copied!</h3>
              <p className="text-gray-600">Profile link has been copied to clipboard</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;