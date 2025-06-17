import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, Target } from 'lucide-react';

const PerformanceChart = ({ studentId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('rating'); // rating, problems, contests

  useEffect(() => {
    fetchAnalytics();
  }, [studentId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getStudentAnalytics(studentId);
      setAnalytics(data.data);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 2000) return '#dc2626'; // red
    if (rating >= 1500) return '#ea580c'; // orange
    if (rating >= 1200) return '#2563eb'; // blue
    if (rating >= 1000) return '#16a34a'; // green
    return '#6b7280'; // gray
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.history || analytics.history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No performance data available yet.
          </p>
        </div>
      </div>
    );
  }

  const chartData = analytics.history.map(item => ({
    ...item,
    date: formatDate(item.date),
    ratingColor: getRatingColor(item.rating)
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'rating':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'problems':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area 
                type="monotone" 
                dataKey="problemsSolved" 
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'contests':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line 
                type="monotone" 
                dataKey="contestsParticipated" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getPerformanceTrend = () => {
    if (chartData.length < 2) return { trend: 'neutral', change: 0 };
    
    const firstRating = chartData[0].rating;
    const lastRating = chartData[chartData.length - 1].rating;
    const change = lastRating - firstRating;
    
    if (change > 0) return { trend: 'up', change };
    if (change < 0) return { trend: 'down', change: Math.abs(change) };
    return { trend: 'neutral', change: 0 };
  };

  const performanceTrend = getPerformanceTrend();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Performance Analytics
        </h2>
        <div className="flex items-center space-x-2">
          {performanceTrend.trend !== 'neutral' && (
            <div className="flex items-center text-sm">
              {performanceTrend.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={performanceTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {performanceTrend.change} pts
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setChartType('rating')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            chartType === 'rating'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Rating
        </button>
        <button
          onClick={() => setChartType('problems')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            chartType === 'problems'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Problems Solved
        </button>
        <button
          onClick={() => setChartType('contests')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            chartType === 'contests'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Contests
        </button>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {renderChart()}
      </div>

      {/* Performance Metrics */}
      {analytics.performance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.performance.averageRatingChange > 0 ? '+' : ''}
              {analytics.performance.averageRatingChange}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Rating Change
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.performance.problemSolvingRate}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Problems/Month
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.performance.contestParticipationRate}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Contests/Month
            </div>
          </div>
        </div>
      )}

      {/* Streak Information */}
      {analytics.streak && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Current Streak
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep up the momentum!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">
                {analytics.streak.currentStreak}
              </div>
              <div className="text-sm text-gray-500">
                days
              </div>
            </div>
          </div>
          {analytics.streak.maxStreak > analytics.streak.currentStreak && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Best streak: {analytics.streak.maxStreak} days
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceChart; 