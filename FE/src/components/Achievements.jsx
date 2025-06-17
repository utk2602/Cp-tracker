import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Award,
  Crown,
  Flame,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

const Achievements = ({ studentId }) => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, [studentId]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getStudentAchievements(studentId);
      setAchievements(data.data.achievements);
      setNewAchievements(data.data.newAchievements);
    } catch (err) {
      setError('Failed to fetch achievements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const achievementConfig = {
    first_contest: {
      title: 'First Contest',
      description: 'Participated in your first competitive programming contest',
      icon: Trophy,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    rating_1000: {
      title: 'Rising Star',
      description: 'Reached 1000+ rating',
      icon: Star,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    rating_1500: {
      title: 'Expert Coder',
      description: 'Reached 1500+ rating',
      icon: Target,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    rating_2000: {
      title: 'Master Programmer',
      description: 'Reached 2000+ rating',
      icon: Crown,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    streak_7: {
      title: 'Week Warrior',
      description: 'Maintained a 7-day solving streak',
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    },
    streak_30: {
      title: 'Consistency King',
      description: 'Maintained a 30-day solving streak',
      icon: Flame,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    problems_50: {
      title: 'Problem Solver',
      description: 'Solved 50+ problems',
      icon: CheckCircle,
      color: 'bg-green-600',
      textColor: 'text-green-600'
    },
    problems_100: {
      title: 'Century Club',
      description: 'Solved 100+ problems',
      icon: TrendingUp,
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    problems_200: {
      title: 'Problem Master',
      description: 'Solved 200+ problems',
      icon: Award,
      color: 'bg-purple-600',
      textColor: 'text-purple-600'
    },
    contest_master: {
      title: 'Contest Master',
      description: 'Participated in 10+ contests',
      icon: Users,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500'
    },
    speed_solver: {
      title: 'Speed Solver',
      description: 'Solved 5+ problems in a single day',
      icon: Zap,
      color: 'bg-yellow-600',
      textColor: 'text-yellow-600'
    },
    consistency_king: {
      title: 'Long-term Player',
      description: 'Active for 3+ months',
      icon: Clock,
      color: 'bg-gray-600',
      textColor: 'text-gray-600'
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <button 
            onClick={fetchAchievements}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {achievements.length} unlocked
        </div>
      </div>

      {/* New Achievements Notification */}
      {newAchievements.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              New achievements unlocked! 🎉
            </span>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(achievementConfig).map(([key, config]) => {
          const isUnlocked = achievements.includes(key);
          const isNew = newAchievements.includes(key);
          const IconComponent = config.icon;

          return (
            <div
              key={key}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                isUnlocked
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-25 dark:bg-gray-800/50 opacity-50'
              } ${isNew ? 'animate-pulse ring-2 ring-green-500' : ''}`}
            >
              {/* New Badge */}
              {isNew && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                    NEW!
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${config.color} ${isUnlocked ? '' : 'opacity-30'}`}>
                  <IconComponent className={`w-6 h-6 text-white`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isUnlocked 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {config.title}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    isUnlocked 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {config.description}
                  </p>
                </div>
              </div>

              {/* Unlock Status */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  {isUnlocked ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  )}
                  <span className={`text-xs ${
                    isUnlocked 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Progress */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {achievements.length} / {Object.keys(achievementConfig).length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(achievements.length / Object.keys(achievementConfig).length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 