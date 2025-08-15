import React, { useState } from 'react';
import { Newspaper, TrendingUp, Clock, ExternalLink, Heart, MessageCircle, Share, Filter, Search } from 'lucide-react';

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All News', color: 'from-blue-500 to-blue-600' },
    { id: 'tech', name: 'Technology', color: 'from-purple-500 to-purple-600' },
    { id: 'social', name: 'Social Media', color: 'from-pink-500 to-red-500' },
    { id: 'trending', name: 'Trending', color: 'from-orange-500 to-red-500' },
    { id: 'community', name: 'Community', color: 'from-green-500 to-teal-500' },
  ];

  const newsArticles = [
    {
      id: 1,
      title: "New Social Media Trends Shaping 2025",
      summary: "Discover the latest trends in social media that are revolutionizing how we connect and share content online.",
      category: 'social',
      author: 'Tech Insider',
      publishedAt: '2h ago',
      readTime: '5 min read',
      likes: 234,
      comments: 45,
      image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      trending: true
    },
    {
      id: 2,
      title: "The Future of Digital Photography",
      summary: "Exploring how AI and machine learning are transforming the way we capture and edit photos.",
      category: 'tech',
      author: 'Photo Weekly',
      publishedAt: '4h ago',
      readTime: '8 min read',
      likes: 189,
      comments: 32,
      image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      trending: false
    },
    {
      id: 3,
      title: "Community Building in the Digital Age",
      summary: "How online platforms are fostering real connections and meaningful relationships.",
      category: 'community',
      author: 'Social Connect',
      publishedAt: '6h ago',
      readTime: '6 min read',
      likes: 156,
      comments: 28,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      trending: true
    },
    {
      id: 4,
      title: "Privacy and Security in Social Networks",
      summary: "Understanding the importance of data protection and privacy settings in modern social platforms.",
      category: 'tech',
      author: 'Security Today',
      publishedAt: '8h ago',
      readTime: '7 min read',
      likes: 298,
      comments: 67,
      image: 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=800',
      trending: false
    },
    {
      id: 5,
      title: "The Rise of Visual Storytelling",
      summary: "How images and videos are becoming the primary language of digital communication.",
      category: 'social',
      author: 'Digital Stories',
      publishedAt: '12h ago',
      readTime: '4 min read',
      likes: 445,
      comments: 89,
      image: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=800',
      trending: true
    },
    {
      id: 6,
      title: "Building Authentic Online Presence",
      summary: "Tips and strategies for creating genuine connections and authentic content in social media.",
      category: 'community',
      author: 'Authentic Voice',
      publishedAt: '1d ago',
      readTime: '9 min read',
      likes: 167,
      comments: 34,
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=800',
      trending: false
    }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-orange-50/50 to-red-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
                <p className="text-sm text-gray-600">Stay informed with the latest trends</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>Live updates</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Articles */}
      <div className="space-y-6">
        {filteredArticles.map((article, index) => (
          <article 
            key={article.id}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 md:h-full object-cover"
                />
                {article.trending && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Trending</span>
                  </div>
                )}
                <div className={`absolute top-4 right-4 bg-gradient-to-r ${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                  {categories.find(cat => cat.id === article.category)?.name}
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">{article.author}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.publishedAt}</span>
                  </div>
                  <span>{article.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                  {article.title}
                </h2>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {article.summary}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{article.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{article.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                      <Share className="h-4 w-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                    <span>Read More</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or category filter.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold"
            >
              Show All News
            </button>
          </div>
        </div>
      )}

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

export default News;