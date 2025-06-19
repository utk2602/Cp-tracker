import axios from 'axios';

const API_BASE_URL = 'https://cp-tracker-1.onrender.com/api';

// Analytics API functions
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const getDepartmentStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/department-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
};

export const getGlobalStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/global-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global stats:', error);
    throw error;
  }
};

export const getStudentAchievements = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/achievements/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

export const getStudentAnalytics = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    throw error;
  }
}; 