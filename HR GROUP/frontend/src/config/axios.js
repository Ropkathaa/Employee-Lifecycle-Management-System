import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Attach JWT Authorization token if available in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized redirects)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to network or timeout
    if (!error.response) {
      console.error('Network Error: Please check if server is running.');
      return Promise.reject(new Error('Network connection error.'));
    }

    const { status } = error.response;

    // Handle global HTTP status codes
    if (status === 401) {
      // Remove stale token and redirect if necessary
      localStorage.removeItem('token');
      // Avoid hardcoding window locations if router redirect is preferred, 
      // but log it as a baseline action.
      console.warn('Unauthorized request. Redirecting or prompting login.');
    } else if (status === 403) {
      console.error('Forbidden: You do not have permissions for this action.');
    } else if (status >= 500) {
      console.error('Internal Server Error: Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
