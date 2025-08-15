import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image, Sparkles, Wand2, Video, FileImage } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'device'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageUrl.trim()) return;

    setLoading(true);
    try {
      createPost({
        userId: user.id,
        username: user.username,
        userProfilePicture: user.profilePicture,
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server or cloud storage
      // For demo purposes, we'll create a local URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleImages = [
    'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1834819/pexels-photo-1834819.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const captionSuggestions = [
    "Living my best life ✨",
    "Moments like these 💫",
    "Grateful for today 🙏",
    "Adventure awaits 🌟",
    "Making memories 📸",
    "Beautiful day ahead ☀️"
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create new post</h2>
              <p className="text-sm text-gray-600">Share your moment with the world</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100/80 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Upload Method Selection */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  uploadMethod === 'url'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>URL</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('device')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  uploadMethod === 'device'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                <FileImage className="h-4 w-4" />
                <span>Device</span>
              </button>
            </div>
          </div>

          {/* Image Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <Image className="h-4 w-4 mr-2 text-blue-600" />
              Choose your image
            </label>
            
            {uploadMethod === 'url' ? (
              <>
                {/* Image URL Input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Paste image URL here..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-gray-50/50 transition-all duration-200"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Sample Images */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-700">Or choose from our gallery:</p>
                    <Wand2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {sampleImages.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setImageUrl(url)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 transform hover:scale-105 ${
                          imageUrl === url 
                            ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                            : 'border-gray-200/50 hover:border-gray-300 shadow-md hover:shadow-lg'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {imageUrl === url && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Camera className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Device Upload */
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-blue-500/50 hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center space-y-4"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <FileImage className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 mb-2">Upload from device</p>
                    <p className="text-sm text-gray-600">Click to select images or videos from your device</p>
                    <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, GIF, MP4, MOV</p>
                  </div>
                </button>
              </div>
            )}

            {/* Preview */}
            {imageUrl && (
              <div className="border border-gray-200/50 rounded-xl overflow-hidden shadow-lg animate-fade-in">
                {imageUrl.startsWith('data:video') || imageUrl.includes('.mp4') || imageUrl.includes('.mov') ? (
                  <video
                    src={imageUrl}
                    controls
                    className="w-full h-auto object-cover max-h-96"
                    onError={() => setImageUrl('')}
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-auto object-cover max-h-96"
                    onError={() => setImageUrl('')}
                  />
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
              Write a caption
            </label>
            <textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none bg-gray-50/50 transition-all duration-200"
            />
            
            {/* Caption Suggestions */}
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {captionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCaption(suggestion)}
                    className="px-3 py-1 text-xs bg-gray-100/80 hover:bg-blue-100/80 text-gray-700 hover:text-blue-700 rounded-full transition-colors border border-gray-200/50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!imageUrl.trim() || loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <Camera className="h-5 w-5 mr-2" />
                Share Your Moment
                <Sparkles className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreatePost;