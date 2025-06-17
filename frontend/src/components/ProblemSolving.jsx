import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Calendar, Zap, Award } from 'lucide-react';

function ProblemSolving({ problems }) {
  const [filterDays, setFilterDays] = useState(30);

  const filteredProblems = useMemo(() => {
    if (!problems || problems.length === 0) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filterDays);
    
    return problems.filter(problem => new Date(problem.solvedAt) >= cutoffDate);
  }, [problems, filterDays]);

  const stats = useMemo(() => {
    if (filteredProblems.length === 0) return null;

    const ratings = filteredProblems.map(p => p.rating).filter(r => r > 0);
    const totalProblems = filteredProblems.length;
    const averageRating = ratings.length > 0 ? Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length) : 0;
    const maxRating = Math.max(...ratings, 0);
    const averagePerDay = Math.round((totalProblems / filterDays) * 10) / 10;

    // Find most difficult problem solved
    const mostDifficultProblem = filteredProblems
      .filter(p => p.rating > 0)
      .sort((a, b) => b.rating - a.rating)[0];

    // Group problems by rating buckets
    const ratingBuckets = {};
    filteredProblems.forEach(problem => {
      if (problem.rating > 0) {
        const bucket = Math.floor(problem.rating / 100) * 100;
        const bucketKey = `${bucket}-${bucket + 99}`;
        ratingBuckets[bucketKey] = (ratingBuckets[bucketKey] || 0) + 1;
      }
    });

    const chartData = Object.entries(ratingBuckets)
      .map(([bucket, count]) => ({
        bucket,
        count
      }))
      .sort((a, b) => parseInt(a.bucket.split('-')[0]) - parseInt(b.bucket.split('-')[0]));

    return {
      totalProblems,
      averageRating,
      maxRating,
      averagePerDay,
      mostDifficultProblem,
      chartData
    };
  }, [filteredProblems, filterDays]);

  if (!problems || problems.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Problem Solving
          </h2>
          <div className="flex space-x-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                disabled
                className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No problem solving data available</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Sync the student data to see problem solving history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Problem Solving
        </h2>
        <div className="flex space-x-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setFilterDays(days)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filterDays === days
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400">Total Problems</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalProblems}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-600 dark:text-green-400">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.averageRating}</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-600 dark:text-purple-400">Max Rating</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.maxRating}</p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-orange-600 dark:text-orange-400">Per Day</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.averagePerDay}</p>
            </div>
          </div>

          {/* Most Difficult Problem */}
          {stats.mostDifficultProblem && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Most Difficult Problem Solved
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Problem</p>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    {stats.mostDifficultProblem.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Rating</p>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    {stats.mostDifficultProblem.rating}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rating Distribution Chart */}
          {stats.chartData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Problems by Rating</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="bucket" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Problems */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recent Problems</h3>
            <div className="space-y-2">
              {filteredProblems.slice(-5).reverse().map((problem, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {problem.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(problem.solvedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {problem.rating || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rating
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No problems solved in the selected period</p>
        </div>
      )}
    </div>
  );
}

export default ProblemSolving; 