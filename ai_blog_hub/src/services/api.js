// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (refreshToken) {
//         try {
//           const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
//             refresh: refreshToken,
//           });
          
//           const { access } = response.data;
//           localStorage.setItem('access_token', access);
          
//           return api(originalRequest);
//         } catch (refreshError) {
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//           window.location.href = '/login';
//         }
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Authentication APIs
// export const authAPI = {
//   register: (userData) => api.post('/register/', userData),
//   login: (credentials) => api.post('/token/', credentials),
//   refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
// };

// // Blog APIs
// export const blogAPI = {
//   getAllBlogs: () => api.get('/blogs/'),
//   getBlog: (id) => api.get(`/blogs/${id}/`),
//   createBlog: (blogData) => api.post('/blogs/', blogData),
//   updateBlog: (id, blogData) => api.put(`/blogs/${id}/`, blogData),
//   partialUpdateBlog: (id, blogData) => api.patch(`/blogs/${id}/`, blogData),
//   deleteBlog: (id) => api.delete(`/blogs/${id}/`),
// };

// // Superuser SEO APIs
// export const seoAPI = {
//   previewRefresh: (id) => api.get(`/superuser/refresh-blog/${id}/preview-refresh/`),
//   confirmRefresh: (id) => api.post(`/superuser/refresh-blog/${id}/confirm-refresh/`),
// };

// export default api;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/token/', credentials),
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
};

// Blog APIs
export const blogAPI = {
  getAllBlogs: () => api.get('/blogs/'),
  getBlog: (id) => api.get(`/blogs/${id}/`),
  createBlog: (blogData) => api.post('/blogs/', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}/`, blogData),
  partialUpdateBlog: (id, blogData) => api.patch(`/blogs/${id}/`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}/`),
};

// SEO APIs
export const seoAPI = {
  previewRefresh: (id) => api.get(`/refresh-blog/${id}/preview/`),
  confirmRefresh: (id) => api.post(`/refresh-blog/${id}/confirm/`),
};

export default api;
