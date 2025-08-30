import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { mockBlogs } from '../data/mockBlogs';
import { ArrowLeft, Calendar, User, Tag, Share2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorDisplay from './ErrorDisplay';

const PublicBlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const blogResponse = await blogAPI.getBlog(id);
      setBlog(blogResponse.data);

      const allBlogsResponse = await blogAPI.getAllBlogs();
      const allBlogs = allBlogsResponse.data;
      const related = allBlogs
        .filter(b => b.id !== parseInt(id) && b.topic === blogResponse.data.topic)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'fetch blog details');
      if (errorMessage.includes('Network Error')) {
        console.warn(`API network error. Falling back to mock data for Blog ID: ${id}.`);
        const mockBlog = mockBlogs.find(b => b.id === parseInt(id));
        if (mockBlog) {
          setBlog(mockBlog);
          const related = mockBlogs
            .filter(b => b.id !== parseInt(id) && b.topic === mockBlog.topic)
            .slice(0, 3);
          setRelatedBlogs(related);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.meta_tags?.description || blog.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  if (!blog) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <BookOpen className="h-6 w-6 text-red-400 dark:text-red-500" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Blog not found</h3>
        <p className="mt-1 text-gray-600 dark:text-gray-400 mb-4">
          The requested blog post could not be found.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Blogs
          </Link>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>

        <article className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-8 lg:p-12">
            <header className="mb-8">
              {blog.topic && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Tag className="w-4 h-4 mr-1" />
                    {blog.topic}
                  </span>
                </div>
              )}
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{blog.meta_tags?.author || 'Anonymous'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Published {formatDate(blog.created_at)}</span>
                </div>
                {blog.updated_at && blog.updated_at !== blog.created_at && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Updated {formatDate(blog.updated_at)}</span>
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {blog.meta_tags?.keywords && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.meta_tags.keywords.split(',').map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {relatedBlogs.length > 0 && (
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  to={`/blogs/${relatedBlog.id}`}
                  className="group"
                >
                  <article className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:bg-gray-700/50 transition-all duration-200">
                    {relatedBlog.topic && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                        {relatedBlog.topic}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {relatedBlog.content.substring(0, 120)}...
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
};

export default PublicBlogDetail;
