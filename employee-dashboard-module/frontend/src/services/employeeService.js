import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/employee-dashboard';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const employeeService = {
  getAll: (params = {}) => apiClient.get('/employees', { params }),

  getById: (id) => apiClient.get(`/employees/${id}`),

  create: (data) => apiClient.post('/employees', data),

  update: (id, data) => apiClient.put(`/employees/${id}`, data),

  delete: (id) => apiClient.delete(`/employees/${id}`),

  // Profile endpoints
  getProfile: () => apiClient.get('/employee/profile'),

  updateProfile: (data) => apiClient.put('/employee/profile', data),

  uploadProfileAvatar: (formData, onUploadProgress) =>
    apiClient.put('/employee/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  // Dashboard endpoint
  getDashboard: () => apiClient.get('/employee/dashboard'),

  // Leave Management endpoints
  getLeaves: (params = {}) => apiClient.get('/employee/leaves', { params }),

  getLeaveById: (id) => apiClient.get(`/employee/leaves/${id}`),

  createLeave: (data) => apiClient.post('/employee/leaves', data),

  updateLeave: (id, data) => apiClient.put(`/employee/leaves/${id}`, data),

  cancelLeave: (id) => apiClient.delete(`/employee/leaves/${id}`),

  // Document Management endpoints
  getDocuments: (params = {}) => apiClient.get('/employee/documents', { params }),

  uploadDocument: (formData, onUploadProgress) =>
    apiClient.post('/employee/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  bulkUploadDocuments: (formData, onUploadProgress) =>
    apiClient.post('/employee/documents/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  updateDocument: (id, formData, onUploadProgress) =>
    apiClient.put(`/employee/documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  deleteDocument: (id) => apiClient.delete(`/employee/documents/${id}`),

  getDocumentDownloadUrl: (id, inline = false) =>
    `/api/v1/employee-dashboard/employee/documents/${id}/download${inline ? '?inline=true' : ''}`,

  // Training Management endpoints
  getTrainings: (params = {}) => apiClient.get('/employee/trainings', { params }),

  getTrainingById: (id) => apiClient.get(`/employee/trainings/${id}`),

  getTrainingCities: () => apiClient.get('/employee/trainings/cities'),

  registerTraining: (id, data) => apiClient.post(`/employee/trainings/${id}/register`, data),

  updateTrainingProgress: (id, progress) =>
    apiClient.put(`/employee/trainings/${id}/progress`, { progress }),

  getTrainingCertificate: (id) => apiClient.get(`/employee/trainings/${id}/certificate`),

  // Attendance Management endpoints
  getAttendance: (params = {}) => apiClient.get('/employee/attendance', { params }),

  getTodayAttendance: () => apiClient.get('/employee/attendance/today'),

  checkIn: () => apiClient.post('/employee/attendance/checkin'),

  checkOut: () => apiClient.put('/employee/attendance/checkout'),

  getAttendanceHistory: (params = {}) =>
    apiClient.get('/employee/attendance/history', { params }),

  // Notification Center endpoints
  getNotifications: (params = {}) =>
    apiClient.get('/employee/notifications', { params }),

  getNotificationById: (id) => apiClient.get(`/employee/notifications/${id}`),

  markNotificationAsRead: (id) =>
    apiClient.put(`/employee/notifications/${id}/read`),

  markAllNotificationsAsRead: () =>
    apiClient.put('/employee/notifications/read-all'),

  deleteNotification: (id) => apiClient.delete(`/employee/notifications/${id}`),

  generateDemoNotification: (data = {}) =>
    apiClient.post('/employee/notifications/generate-demo', data),
};

export default apiClient;

