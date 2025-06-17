const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Problem = require('../models/Problem');

class AnalyticsService {
  // Calculate streak and activity metrics
  static async calculateStreakAndActivity(studentId) {
    const student = await Student.findById(studentId);
    if (!student) return null;

    const problems = await Problem.find({ student: studentId }).sort({ solvedDate: -1 });
    const contests = await Contest.find({ student: studentId }).sort({ contestDate: -1 });

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let lastActiveDate = null;

    // Calculate streak based on problem solving activity
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    for (let i = 0; i < problems.length; i++) {
      const problemDate = new Date(problems[i].solvedDate);
      const daysDiff = Math.floor((today - problemDate) / oneDay);

      if (i === 0) {
        lastActiveDate = problemDate;
        if (daysDiff === 0) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const prevProblemDate = new Date(problems[i - 1].solvedDate);
        const daysBetween = Math.floor((prevProblemDate - problemDate) / oneDay);

        if (daysBetween <= 1) {
          tempStreak++;
          if (i === problems.length - 1) {
            maxStreak = Math.max(maxStreak, tempStreak);
          }
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    return {
      currentStreak,
      maxStreak,
      lastActiveDate,
      totalProblems: problems.length
    };
  }

  // Calculate performance metrics
  static async calculatePerformanceMetrics(studentId) {
    const contests = await Contest.find({ student: studentId }).sort({ contestDate: -1 });
    
    if (contests.length === 0) {
      return {
        averageRatingChange: 0,
        contestParticipationRate: 0,
        problemSolvingRate: 0
      };
    }

    // Calculate average rating change
    const ratingChanges = contests.map(contest => contest.newRating - contest.oldRating);
    const averageRatingChange = ratingChanges.reduce((sum, change) => sum + change, 0) / ratingChanges.length;

    // Calculate contest participation rate (contests per month)
    const firstContest = contests[contests.length - 1];
    const lastContest = contests[0];
    const monthsActive = (lastContest.contestDate - firstContest.contestDate) / (1000 * 60 * 60 * 24 * 30);
    const contestParticipationRate = monthsActive > 0 ? contests.length / monthsActive : 0;

    // Calculate problem solving rate (problems per month)
    const problems = await Problem.find({ student: studentId });
    const problemSolvingRate = monthsActive > 0 ? problems.length / monthsActive : 0;

    return {
      averageRatingChange: Math.round(averageRatingChange * 100) / 100,
      contestParticipationRate: Math.round(contestParticipationRate * 100) / 100,
      problemSolvingRate: Math.round(problemSolvingRate * 100) / 100
    };
  }

  // Check and award achievements
  static async checkAchievements(studentId) {
    const student = await Student.findById(studentId);
    if (!student) return [];

    const newAchievements = [];
    const existingAchievements = student.achievements || [];

    // Rating achievements
    if (student.currentRating >= 1000 && !existingAchievements.includes('rating_1000')) {
      newAchievements.push('rating_1000');
    }
    if (student.currentRating >= 1500 && !existingAchievements.includes('rating_1500')) {
      newAchievements.push('rating_1500');
    }
    if (student.currentRating >= 2000 && !existingAchievements.includes('rating_2000')) {
      newAchievements.push('rating_2000');
    }

    // Streak achievements
    if (student.currentStreak >= 7 && !existingAchievements.includes('streak_7')) {
      newAchievements.push('streak_7');
    }
    if (student.currentStreak >= 30 && !existingAchievements.includes('streak_30')) {
      newAchievements.push('streak_30');
    }

    // Problem solving achievements
    if (student.totalProblemsSolved >= 50 && !existingAchievements.includes('problems_50')) {
      newAchievements.push('problems_50');
    }
    if (student.totalProblemsSolved >= 100 && !existingAchievements.includes('problems_100')) {
      newAchievements.push('problems_100');
    }
    if (student.totalProblemsSolved >= 200 && !existingAchievements.includes('problems_200')) {
      newAchievements.push('problems_200');
    }

    // Contest participation achievements
    const contests = await Contest.find({ student: studentId });
    if (contests.length >= 10 && !existingAchievements.includes('contest_master')) {
      newAchievements.push('contest_master');
    }

    // Speed solving achievement (solved 5+ problems in a day)
    const problems = await Problem.find({ student: studentId });
    const problemsByDate = {};
    problems.forEach(problem => {
      const date = problem.solvedDate.toDateString();
      problemsByDate[date] = (problemsByDate[date] || 0) + 1;
    });
    
    const hasSpeedSolving = Object.values(problemsByDate).some(count => count >= 5);
    if (hasSpeedSolving && !existingAchievements.includes('speed_solver')) {
      newAchievements.push('speed_solver');
    }

    // Consistency achievement (active for 3+ months)
    if (contests.length > 0) {
      const firstContest = contests[contests.length - 1];
      const monthsActive = (new Date() - firstContest.contestDate) / (1000 * 60 * 60 * 24 * 30);
      if (monthsActive >= 3 && !existingAchievements.includes('consistency_king')) {
        newAchievements.push('consistency_king');
      }
    }

    // First contest achievement
    if (contests.length > 0 && !existingAchievements.includes('first_contest')) {
      newAchievements.push('first_contest');
    }

    return newAchievements;
  }

  // Generate performance history
  static async generatePerformanceHistory(studentId) {
    const contests = await Contest.find({ student: studentId }).sort({ contestDate: 1 });
    const problems = await Problem.find({ student: studentId }).sort({ solvedDate: 1 });

    const performanceHistory = [];
    let cumulativeProblems = 0;

    contests.forEach((contest, index) => {
      const problemsBeforeContest = problems.filter(p => p.solvedDate <= contest.contestDate).length;
      cumulativeProblems = problemsBeforeContest;

      performanceHistory.push({
        date: contest.contestDate,
        rating: contest.newRating,
        problemsSolved: cumulativeProblems,
        contestsParticipated: index + 1
      });
    });

    return performanceHistory;
  }

  // Get leaderboard data
  static async getLeaderboard() {
    const students = await Student.find().sort({ currentRating: -1 }).limit(10);
    
    return students.map((student, index) => ({
      rank: index + 1,
      name: student.name,
      codeforcesHandle: student.codeforcesHandle,
      currentRating: student.currentRating,
      maxRating: student.maxRating,
      totalProblemsSolved: student.totalProblemsSolved,
      currentStreak: student.currentStreak,
      department: student.department
    }));
  }

  // Get department statistics
  static async getDepartmentStats() {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgRating: { $avg: '$currentRating' },
          avgProblems: { $avg: '$totalProblemsSolved' },
          totalProblems: { $sum: '$totalProblemsSolved' }
        }
      },
      {
        $project: {
          department: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 0] },
          avgProblems: { $round: ['$avgProblems', 0] },
          totalProblems: 1
        }
      },
      { $sort: { avgRating: -1 } }
    ]);

    return stats;
  }
}

module.exports = AnalyticsService; 