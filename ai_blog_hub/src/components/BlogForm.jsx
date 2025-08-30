import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { mockBlogs } from '../data/mockBlogs';
import { Save, ArrowLeft } from 'lucide-react';
import ErrorDisplay from './ErrorDisplay';

const BlogForm = ({ isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topic: '',
    meta_tags: {
      description: '',
      keywords: '',
      author: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      fetchBlog();
    }
  }, [isEdit, id]);

  const fetchBlog = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getBlog(id);
      const blog = response.data;
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        topic: blog.topic || '',
        meta_tags: {
          description: blog.meta_tags?.description || '',
          keywords: blog.meta_tags?.keywords || '',
          author: blog.meta_tags?.author || ''
        }
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'fetch blog details');
      if (errorMessage.includes('Network Error')) {
        console.warn(`API network error. Falling back to mock data for editing Blog ID: ${id}.`);
        const mockBlog = mockBlogs.find(b => b.id === parseInt(id));
        if (mockBlog) {
          setFormData({
            title: mockBlog.title || '',
            content: mockBlog.content || '',
            topic: mockBlog.topic || '',
            meta_tags: {
              description: mockBlog.meta_tags?.description || '',
              keywords: mockBlog.meta_tags?.keywords || '',
              author: mockBlog.meta_tags?.author || ''
            }
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('meta_')) {
      const metaField = name.replace('meta_', '');
      setFormData(prev => ({
        ...prev,
        meta_tags: {
          ...prev.meta_tags,
          [metaField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await blogAPI.updateBlog(id, formData);
      } else {
        await blogAPI.createBlog(formData);
      }
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, `${isEdit ? 'update' : 'create'} blog`);
      if (errorMessage.includes('Network Error')) {
        console.warn(`Simulating ${isEdit ? 'update' : 'creation'} due to network error.`);
        // Here you could update mock data in a real state management solution
        navigate('/admin/dashboard', { state: { message: `Successfully simulated ${isEdit ? 'updating' : 'creating'} blog.` } });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Blog' : 'Create New Blog'}
          </h1>
        </div>
      </div>

      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={isEdit && error.includes('fetch') ? fetchBlog : null} 
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label htmlFor="topic" className={labelClass}>
              Topic
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g., Technology, Lifestyle, Business"
            />
          </div>

          <div>
            <label htmlFor="content" className={labelClass}>
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              required
              value={formData.content}
              onChange={handleChange}
              className={inputClass}
              placeholder="Write your blog content here..."
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">SEO Meta Tags</h3>
          
          <div>
            <label htmlFor="meta_description" className={labelClass}>
              Meta Description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              rows={3}
              value={formData.meta_tags.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Brief description for search engines"
            />
          </div>

          <div>
            <label htmlFor="meta_keywords" className={labelClass}>
              Keywords
            </label>
            <input
              type="text"
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_tags.keywords}
              onChange={handleChange}
              className={inputClass}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div>
            <label htmlFor="meta_author" className={labelClass}>
              Author
            </label>
            <input
              type="text"
              id="meta_author"
              name="meta_author"
              value={formData.meta_tags.author}
              onChange={handleChange}
              className={inputClass}
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Blog' : 'Create Blog')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
