import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { LogOut, Home, PlusCircle, RefreshCw, Settings, BookOpen, User } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      location.pathname === '/login' || 
                      location.pathname === '/register';

  // Public Layout
  if (!isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span>AI Blog Hub</span>
                </Link>
                
                <div className="hidden md:flex space-x-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThemeToggleButton />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/admin"
                      className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              © 2025 AI Blog Hub. Built with React and Django REST API.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Admin Layout
  if (!isAuthenticated && (location.pathname !== '/login' && location.pathname !== '/register')) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin" className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
                <Settings className="w-6 h-6 text-blue-600" />
                <span>Admin Panel</span>
              </Link>
              
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/admin/create-blog"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Blog</span>
                </Link>
                
                <Link
                  to="/admin/seo-management"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>SEO Management</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggleButton />
              <Link
                to="/"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Site</span>
              </Link>
              
              <span className="hidden lg:inline text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user?.username}
                {user?.is_superuser && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">Admin</span>}
              </span>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
