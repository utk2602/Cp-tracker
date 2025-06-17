const AnalyticsService = require('../services/analyticsService');
const Student = require('../models/Student');

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await AnalyticsService.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const stats = await AnalyticsService.getDepartmentStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ message: 'Error fetching department statistics' });
  }
};

// Get student achievements
const getStudentAchievements = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for new achievements
    const newAchievements = await AnalyticsService.checkAchievements(id);
    
    // Update student with new achievements
    if (newAchievements.length > 0) {
      student.achievements = [...(student.achievements || []), ...newAchievements];
      await student.save();
    }

    res.json({
      achievements: student.achievements || [],
      newAchievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

// Get performance analytics for a student
const getStudentAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [streakData, performanceMetrics, performanceHistory] = await Promise.all([
      AnalyticsService.calculateStreakAndActivity(id),
      AnalyticsService.calculatePerformanceMetrics(id),
      AnalyticsService.generatePerformanceHistory(id)
    ]);

    res.json({
      streak: streakData,
      performance: performanceMetrics,
      history: performanceHistory
    });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    res.status(500).json({ message: 'Error fetching student analytics' });
  }
};

// Get global statistics
const getGlobalStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalProblems,
      avgRating,
      topPerformer
    ] = await Promise.all([
      Student.countDocuments(),
      Student.aggregate([
        { $group: { _id: null, total: { $sum: '$totalProblemsSolved' } } }
      ]),
      Student.aggregate([
        { $group: { _id: null, avg: { $avg: '$currentRating' } } }
      ]),
      Student.findOne().sort({ currentRating: -1 })
    ]);

    const stats = {
      totalStudents,
      totalProblemsSolved: totalProblems[0]?.total || 0,
      averageRating: Math.round(avgRating[0]?.avg || 0),
      topPerformer: topPerformer ? {
        name: topPerformer.name,
        rating: topPerformer.currentRating,
        problems: topPerformer.totalProblemsSolved
      } : null
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ message: 'Error fetching global statistics' });
  }
};

module.exports = {
  getLeaderboard,
  getDepartmentStats,
  getStudentAchievements,
  getStudentAnalytics,
  getGlobalStats
}; 