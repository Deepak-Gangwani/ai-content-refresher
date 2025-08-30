import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { mockBlogs } from '../data/mockBlogs';
import { PlusCircle, Edit, Trash2, Eye, Calendar, User, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorDisplay from './ErrorDisplay';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getAllBlogs();
      setBlogs(response.data);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'fetch blogs');
      if (errorMessage.includes('Network Error')) {
        console.warn('API network error. Falling back to mock data for Dashboard.');
        setBlogs(mockBlogs);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogAPI.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (error) {
        // If using mock data, simulate deletion
        if (getApiErrorMessage(error).includes('Network Error')) {
          setBlogs(blogs.filter(blog => blog.id !== id));
          console.log(`Simulated deletion of mock blog with id: ${id}`);
        } else {
          alert(`Failed to delete blog: ${getApiErrorMessage(error, 'delete blog')}`);
        }
      }
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your blog posts</p>
        </div>
        
        <Link
          to="/admin/create-blog"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <PlusCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No blogs</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new blog post.</p>
          <div className="mt-6">
            <Link
              to="/admin/create-blog"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              New Blog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {blog.topic || 'General'}
                  </span>
                  <div className="flex space-x-3">
                    <Link
                      to={`/blogs/${blog.id}`}
                      target="_blank"
                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Public"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/seo-management/preview/${blog.id}`}
                      className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      title="Preview SEO Refresh"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/edit-blog/${blog.id}`}
                      className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Edit Blog"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete Blog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{blog.meta_tags?.author || 'Author'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(blog.created_at || blog.updated_at)}</span>
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

export default Dashboard;
