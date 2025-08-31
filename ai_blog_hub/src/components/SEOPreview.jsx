import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI, seoAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { useAuth } from '../contexts/AuthContext';
import { mockBlogs } from '../data/mockBlogs';
import ErrorDisplay from './ErrorDisplay';
import DiffViewer from './DiffViewer';
import { ArrowLeft, Check, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const SEOPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [originalBlog, setOriginalBlog] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [originalRes, previewRes] = await Promise.all([
        blogAPI.getBlog(id),
        seoAPI.previewRefresh(id),
      ]);
      setOriginalBlog(originalRes.data);
      setPreviewBlog(previewRes.data);
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'fetch blog preview');
      if (errorMessage.includes('Network Error')) {
        console.warn(`API network error. Falling back to mock data for SEO Preview on Blog ID: ${id}.`);
        const mockOriginal = mockBlogs.find(b => b.id === parseInt(id));
        if (mockOriginal) {
          setOriginalBlog(mockOriginal);
          // Simulate an AI refresh for mock data
          const mockPreview = {
            ...mockOriginal,
            title: `[AI Enhanced] ${mockOriginal.title}`,
            content: `This is an AI-enhanced version of the original content. ${mockOriginal.content}`,
            meta_tags: {
              ...mockOriginal.meta_tags,
              description: `Optimized for SEO: ${mockOriginal.meta_tags.description}`,
              keywords: `${mockOriginal.meta_tags.keywords}, ai, seo, optimized`,
            }
          };
          setPreviewBlog(mockPreview);
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

  useEffect(() => {
    fetchData();
  }, [id]);

const handleConfirm = async () => {
  setConfirming(true);
  setError('');
  try {
    await seoAPI.confirmRefresh(id, {
      title: previewBlog.preview_title,
      content: previewBlog.preview_content,
      meta_tags: {
        description: previewBlog.preview_meta_tags?.description,
        keywords: previewBlog.preview_meta_tags?.keywords,
      }
    });

    navigate('/admin/seo-management', {
      state: { message: `Blog "${originalBlog.title}" has been successfully refreshed.` },
    });
  } catch (err) {
    const errorMessage = getApiErrorMessage(err, 'confirm blog refresh');
    setError(errorMessage);
    setConfirming(false);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Generating AI-powered SEO preview...</p>
      </div>
    );
  }

  if (error && !originalBlog) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }
  
  if (!originalBlog || !previewBlog) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/seo-management')}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to SEO Management
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SEO Refresh Preview</h1>
        <div/>
      </div>

      {error && <ErrorDisplay error={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Version */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Current Version</h2>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Title</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">{originalBlog.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto">{originalBlog.content}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Meta Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">{originalBlog.meta_tags?.description || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Keywords</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">{originalBlog.meta_tags?.keywords || 'N/A'}</p>
          </div>
        </div>

        {/* AI-Generated Version with Diff */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4 border border-blue-300 dark:border-blue-700">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800 pb-2">AI-Generated SEO Version</h2>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Title</h3>
            <DiffViewer oldText={originalBlog.title} newText={previewBlog.preview_title} />
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Content</h3>
            <div className="max-h-60 overflow-y-auto">
              <DiffViewer oldText={originalBlog.content} newText={previewBlog.preview_content} />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Meta Description</h3>
            <DiffViewer oldText={originalBlog.meta_tags?.description} newText={previewBlog.preview_meta_tags?.description} />
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Keywords</h3>
            <DiffViewer oldText={originalBlog.meta_tags?.keywords} newText={previewBlog.preview_meta_tags?.keywords} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center space-x-4 pt-4">
        {!user?.is_superuser && (
          <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 mr-auto bg-yellow-50 dark:bg-yellow-900/20 py-2 px-3 rounded-md">
            <ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Only administrators can save changes.</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => navigate('/admin/seo-management')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={confirming}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {confirming ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {confirming ? 'Saving...' : 'Confirm & Save Changes'}
        </button>
      </div>
    </motion.div>
  );
};

export default SEOPreview;
