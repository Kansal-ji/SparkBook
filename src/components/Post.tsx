import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Share } from 'lucide-react';
import { Post as PostType } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import { useUsers } from '../hooks/useUsers';
import { Link } from 'react-router-dom';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = useAuth();
  const { toggleLike, addComment } = usePosts();
  const { getUserById } = useUsers();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user ? post.likes.includes(user.id) : false;
  const postUser = getUserById(post.userId);

  const handleLike = async () => {
    if (user && !isLiking) {
      setIsLiking(true);
      toggleLike(post.id, user.id);
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && comment.trim()) {
      addComment(post.id, {
        userId: user.id,
        username: user.username,
        content: comment.trim(),
      });
      setComment('');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.username}'s post on SparkBook`,
          text: post.caption,
          url: window.location.href,
        });
      } catch (error) {
        // If share fails (permission denied, user cancels, etc.), fall back to clipboard
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  return (
    <article className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${post.userId}`} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 transition-transform">
            {post.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{post.username}</p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </Link>
        <button className="p-2 hover:bg-gray-100/80 rounded-full transition-colors">
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative group">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full h-auto object-cover cursor-pointer"
          onDoubleClick={handleLike}
        />
        {/* Double-tap heart animation */}
        {isLiking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="h-20 w-20 text-red-500 fill-current animate-ping" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`transition-all duration-200 transform hover:scale-110 ${
                isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-gray-700 hover:text-blue-600 transition-colors transform hover:scale-110"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button 
              onClick={handleShare}
              className="text-gray-700 hover:text-green-600 transition-colors transform hover:scale-110"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button className="text-gray-700 hover:text-yellow-600 transition-colors transform hover:scale-110">
            <Bookmark className="h-6 w-6" />
          </button>
        </div>

        {/* Likes */}
        {post.likes.length > 0 && (
          <div className="mb-2">
            <p className="font-semibold text-gray-900">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {post.likes.length}
              </span>
              <span className="ml-1">{post.likes.length === 1 ? 'like' : 'likes'}</span>
            </p>
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <Link to={`/profile/${post.userId}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mr-2">
              {post.username}
            </Link>
            <span className="text-gray-900">{post.caption}</span>
          </div>
        )}

        {/* Comments */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2 hover:text-gray-700 transition-colors font-medium"
          >
            {showComments ? 'Hide' : 'View'} all {post.comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2 p-2 bg-gray-50/50 rounded-lg">
                <Link 
                  to={`/profile/${comment.userId}`} 
                  className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  {comment.username}
                </Link>
                <span className="text-gray-900 text-sm flex-1">{comment.content}</span>
                <span className="text-gray-500 text-xs flex-shrink-0">{formatDate(comment.createdAt)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-3 mt-3 pt-3 border-t border-gray-100/50">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 bg-transparent text-sm placeholder-gray-500 focus:outline-none"
          />
          {comment.trim() && (
            <button
              type="submit"
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
            >
              Post
            </button>
          )}
        </form>
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
              <p className="text-gray-600">Post link has been copied to clipboard</p>
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
    </article>
  );
};

export default Post;