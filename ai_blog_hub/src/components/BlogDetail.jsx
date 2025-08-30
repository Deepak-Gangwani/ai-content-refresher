import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { mockBlogs } from '../data/mockBlogs';
import { getApiErrorMessage } from '../utils/errorHandler';
import { ArrowLeft, Edit, Calendar, User, Tag, RefreshCw } from 'lucide-react';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getBlog(id);
      setBlog(response.data);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'fetch blog details');
      if (errorMessage.includes('Network Error')) {
        console.warn(`API network error. Falling back to mock data for Blog ID: ${id}.`);
        const mockBlog = mockBlogs.find(b => b.id === parseInt(id));
        if (mockBlog) {
          setBlog(mockBlog);
        } else {
          setError(`Blog with ID ${id} not found in mock data.`);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Blog not found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The requested blog post could not be found.'}</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/seo-management/preview/${blog.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Preview SEO Refresh
          </Link>
          <Link
            to={`/admin/edit-blog/${blog.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Blog
          </Link>
        </div>
      </div>

      <article className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-8">
          <div className="mb-6">
            {blog.topic && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-4">
                <Tag className="w-4 h-4 mr-1" />
                {blog.topic}
              </span>
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{blog.meta_tags?.author || 'Author'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Created: {formatDate(blog.created_at)}</span>
              </div>
              {blog.updated_at && blog.updated_at !== blog.created_at && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Updated: {formatDate(blog.updated_at)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none p-8 pt-0">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {(blog.meta_tags?.description || blog.meta_tags?.keywords) && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">SEO Information</h3>
              <div className="space-y-3">
                {blog.meta_tags.description && (
                  <div>
                    <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Description:</dt>
                    <dd className="text-sm text-gray-600 dark:text-gray-400">{blog.meta_tags.description}</dd>
                  </div>
                )}
                {blog.meta_tags.keywords && (
                  <div>
                    <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords:</dt>
                    <dd className="text-sm text-gray-600 dark:text-gray-400">{blog.meta_tags.keywords}</dd>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
