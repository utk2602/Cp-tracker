const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getDepartmentStats,
  getStudentAchievements,
  getStudentAnalytics,
  getGlobalStats
} = require('../controllers/analyticsController');

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Get department statistics
router.get('/department-stats', getDepartmentStats);

// Get global statistics
router.get('/global-stats', getGlobalStats);

// Get student achievements
router.get('/achievements/:id', getStudentAchievements);

// Get student analytics
router.get('/student/:id', getStudentAnalytics);

module.exports = router; 