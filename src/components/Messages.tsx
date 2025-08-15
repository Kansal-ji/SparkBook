import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Image, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { useMessages } from '../hooks/useMessages';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUsers();
  const { conversations, messages, loadMessages, sendMessage, markAsRead } = useMessages();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const handleChatSelect = async (userId: string) => {
    setSelectedChat(userId);
    await loadMessages(userId);
    await markAsRead(userId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || !user) return;

    try {
      await sendMessage(selectedChat, messageInput.trim());
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.participant._id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden h-full flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-green-50/50 to-teal-50/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <p className="text-sm text-gray-600">Stay connected with friends</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => handleChatSelect(conversation.participant._id)}
                className={`w-full p-4 text-left hover:bg-gray-50/80 transition-colors border-b border-gray-100/50 ${
                  selectedChat === conversation.participant._id ? 'bg-blue-50/80 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {conversation.participant.username[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">{conversation.participant.username}</p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage ? conversation.lastMessage.content : 'Start a conversation'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat && selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {selectedConversation.participant.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedConversation.participant.username}
                      </p>
                      <p className="text-sm text-green-600">Active now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-full transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-full transition-colors">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-full transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === user?.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100/80 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-full transition-colors"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-full transition-colors"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;