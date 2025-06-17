import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Trophy, Users, Target, AlertTriangle } from 'lucide-react';

function ContestHistory({ contests }) {
  const [filterDays, setFilterDays] = useState(30);

  const filteredContests = useMemo(() => {
    if (!contests || contests.length === 0) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filterDays);
    
    return contests
      .filter(contest => new Date(contest.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [contests, filterDays]);

  const chartData = useMemo(() => {
    return filteredContests.map((contest, index) => ({
      name: contest.name,
      rating: contest.newRating || 0,
      rank: contest.rank || 0,
      solved: contest.problemsSolved || 0,
      unsolved: contest.problemsUnsolved || 0,
      date: new Date(contest.date).toLocaleDateString()
    }));
  }, [filteredContests]);

  const totalContests = filteredContests.length;
  const averageRank = totalContests > 0 
    ? Math.round(filteredContests.reduce((sum, c) => sum + (c.rank || 0), 0) / totalContests)
    : 0;
  const totalProblemsSolved = filteredContests.reduce((sum, c) => sum + (c.problemsSolved || 0), 0);
  const totalProblemsUnsolved = filteredContests.reduce((sum, c) => sum + (c.problemsUnsolved || 0), 0);

  if (!contests || contests.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contest History
          </h2>
          <div className="flex space-x-2">
            {[30, 90, 365].map((days) => (
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
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No contest data available</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Sync the student data to see contest history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Contest History
        </h2>
        <div className="flex space-x-2">
          {[30, 90, 365].map((days) => (
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-600 dark:text-blue-400">Total Contests</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalContests}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400">Avg Rank</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{averageRank}</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-600 dark:text-purple-400">Problems Solved</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalProblemsSolved}</p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-orange-600 dark:text-orange-400">Problems Unsolved</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{totalProblemsUnsolved}</p>
        </div>
      </div>

      {/* Rating Chart */}
      {chartData.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Rating Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
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
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No contests found in the selected period</p>
        </div>
      )}

      {/* Contests Table */}
      {filteredContests.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recent Contests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Contest
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Rating
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Solved
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Unsolved
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContests.slice(-5).reverse().map((contest, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {contest.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(contest.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {contest.rank || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {contest.newRating || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {contest.problemsSolved || 0}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {contest.problemsUnsolved || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContestHistory; 