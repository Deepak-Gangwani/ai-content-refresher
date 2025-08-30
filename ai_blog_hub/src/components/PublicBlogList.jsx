import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { mockBlogs } from '../data/mockBlogs';
import { Calendar, User, Tag, Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorDisplay from './ErrorDisplay';

const PublicBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedTopic]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getAllBlogs();
      setBlogs(response.data);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'fetch blogs');
      if (errorMessage.includes('Network Error')) {
        console.warn('API network error. Falling back to mock data for PublicBlogList.');
        setBlogs(mockBlogs);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTopic) {
      filtered = filtered.filter(blog => blog.topic === selectedTopic);
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUniqueTopics = () => {
    const topics = blogs.map(blog => blog.topic).filter(Boolean);
    return [...new Set(topics)];
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Blog Hub - AI Content Refresher for SEO</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Discover insightful articles, tutorials, and thoughts from our community of writers
        </p>
      </div>

      {error ? (
        <ErrorDisplay error={error} onRetry={fetchBlogs} />
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="md:w-64">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Topics</option>
                  {getUniqueTopics().map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredBlogs.length} of {blogs.length} blogs
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <BookOpen className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {searchTerm || selectedTopic ? 'No blogs found' : 'No blogs available'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedTopic 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Check back later for new content.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-500/10 transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {blog.topic && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <Tag className="w-3 h-3 mr-1" />
                          {blog.topic}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                      <Link 
                        to={`/blogs/${blog.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {blog.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {truncateContent(blog.content)}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{blog.meta_tags?.author || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(blog.created_at || blog.updated_at)}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicBlogList;
