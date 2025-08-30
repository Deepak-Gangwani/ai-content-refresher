import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { mockBlogs } from '../data/mockBlogs';
import { RefreshCw, Eye, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorDisplay from './ErrorDisplay';

const SEOManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => {
        setSuccessMessage('');
        window.history.replaceState({}, document.title)
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getAllBlogs();
      setBlogs(response.data);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'fetch blogs');
      if (errorMessage.includes('Network Error')) {
        console.warn('API network error. Falling back to mock data for SEOManagement.');
        setBlogs(mockBlogs);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewRefresh = (blogId) => {
    setRefreshLoading(prev => ({ ...prev, [blogId]: 'preview' }));
    navigate(`/admin/seo-management/preview/${blogId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchBlogs} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">SEO Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Refresh and optimize blog content with AI-powered SEO enhancements</p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
            </div>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <RefreshCw className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No blogs available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create some blog posts to manage their SEO.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {blog.title}
                      </h3>
                      {blog.topic && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {blog.topic}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {blog.content.substring(0, 150)}...
                    </p>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {formatDate(blog.updated_at || blog.created_at)}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    <button
                      onClick={() => handlePreviewRefresh(blog.id)}
                      disabled={refreshLoading[blog.id]}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {refreshLoading[blog.id] === 'preview' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      Preview Refresh
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SEOManagement;
