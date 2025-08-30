import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BlogForm from './components/BlogForm';
import BlogDetail from './components/BlogDetail';
import SEOManagement from './components/SEOManagement';
import SEOPreview from './components/SEOPreview';
import PublicBlogList from './components/PublicBlogList';
import PublicBlogDetail from './components/PublicBlogDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicBlogList />} />
              <Route path="/blogs" element={<PublicBlogList />} />
              <Route path="/blogs/:id" element={<PublicBlogDetail />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create-blog"
                element={
                  <ProtectedRoute>
                    <BlogForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-blog/:id"
                element={
                  <ProtectedRoute>
                    <BlogForm isEdit={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/:id"
                element={
                  <ProtectedRoute>
                    <BlogDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/seo-management"
                element={
                  <ProtectedRoute>
                    <SEOManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/seo-management/preview/:id"
                element={
                  <ProtectedRoute>
                    <SEOPreview />
                  </ProtectedRoute>
                }
              />
              
              {/* Legacy redirects for backward compatibility */}
              <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/create-blog" element={<Navigate to="/admin/create-blog" replace />} />
              <Route path="/edit-blog/:id" element={<Navigate to="/admin/edit-blog/:id" replace />} />
              <Route path="/blog/:id" element={<Navigate to="/admin/blog/:id" replace />} />
              <Route path="/seo-management" element={<Navigate to="/admin/seo-management" replace />} />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
