import axios from 'axios';

const API_BASE_URL = 'https://cp-tracker-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student API endpoints
export const studentAPI = {
  // Get all students
  getAllStudents: () => api.get('/students'),
  
  // Get student by ID
  getStudentById: (id) => api.get(`/students/${id}`),
  
  // Create new student
  createStudent: (studentData) => api.post('/students', studentData),
  
  // Update student
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  
  // Delete student
  deleteStudent: (id) => api.delete(`/students/${id}`),
  
  // Get student profile with contests and problems
  getStudentProfile: (id) => api.get(`/students/${id}/profile`),
  
  // Download students data as CSV
  downloadCSV: () => api.get('/students/download/csv'),
  
  // Toggle email reminders for a student
  toggleEmailReminders: (id) => api.post(`/students/${id}/toggle-reminders`),
  
  // Check if student exists
  checkStudent: (id) => api.get(`/students/${id}/check`),
  
  // Sync individual student data - using the correct backend endpoint
  syncStudent: (id) => api.post(`/cron/sync/${id}`),
};

// Cron API endpoints - updated to match backend routes
export const cronAPI = {
  // Get cron settings - using the correct backend endpoint
  getCronSettings: () => api.get('/cron/schedule'),
  
  // Update cron settings - using the correct backend endpoint
  updateCronSettings: (settings) => api.put('/cron/schedule', settings),
  
  // Trigger manual sync - using the correct backend endpoint
  triggerSync: () => api.post('/cron/sync'),
};

// Analytics API endpoints
export const analyticsAPI = {
  // Get leaderboard
  getLeaderboard: () => api.get('/analytics/leaderboard'),
  
  // Get department statistics
  getDepartmentStats: () => api.get('/analytics/department-stats'),
  
  // Get global statistics
  getGlobalStats: () => api.get('/analytics/global-stats'),
  
  // Get student achievements
  getStudentAchievements: (studentId) => api.get(`/analytics/achievements/${studentId}`),
  
  // Get student analytics
  getStudentAnalytics: (studentId) => api.get(`/analytics/student/${studentId}`),
};

export default api; 