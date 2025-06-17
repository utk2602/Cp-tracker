import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Download, Eye, Mail, MailX, Bell, RefreshCw, Users, CheckCircle, Target, Trophy } from 'lucide-react';
import { studentAPI, analyticsAPI } from '../services/api';
import StudentFormModal from '../components/StudentFormModal';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncingStudents, setSyncingStudents] = useState(new Set());
  const [globalStats, setGlobalStats] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, statsData, leaderboardData] = await Promise.all([
        studentAPI.getAllStudents(),
        analyticsAPI.getGlobalStats(),
        analyticsAPI.getLeaderboard()
      ]);
      setStudents(studentsData.data);
      setGlobalStats(statsData.data);
      setTopPerformers(leaderboardData.data.slice(0, 5)); // Top 5 performers
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete student');
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleToggleReminders = async (id) => {
    try {
      await studentAPI.toggleEmailReminders(id);
      fetchData();
    } catch (err) {
      setError('Failed to toggle email reminders');
      console.error('Error toggling reminders:', err);
    }
  };

  const handleSyncStudent = async (id) => {
    try {
      setSyncingStudents(prev => new Set(prev).add(id));
      await studentAPI.syncStudent(id);
      await fetchData(); // Refresh the data
      setError(null);
    } catch (err) {
      console.error('Error syncing student:', err);
      
      // Handle specific error types
      if (err.response?.status === 503) {
        setError('Codeforces is temporarily blocking requests. Please try again later.');
      } else if (err.response?.status === 404) {
        setError('Student not found');
      } else {
        setError('Failed to sync student data. Please try again.');
      }
    } finally {
      setSyncingStudents(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await studentAPI.downloadCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download CSV');
      console.error('Error downloading CSV:', err);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.codeforcesHandle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Students
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage student information and track their progress
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handleAddStudent}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Global Statistics */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {globalStats.totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Problems Solved
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {globalStats.totalProblemsSolved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {globalStats.averageRating}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Top Performer
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {globalStats.topPerformer?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {globalStats.topPerformer?.rating || 0} rating
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performers Preview */}
      {topPerformers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Performers
            </h2>
            <Link 
              to="/leaderboard"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={student.codeforcesHandle} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{student.codeforcesHandle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {student.currentRating}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {student.totalProblemsSolved} problems
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Codeforces
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Solved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reminders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSyncStudent(student._id)}
                        disabled={syncingStudents.has(student._id)}
                        className={`p-1 rounded-md transition-colors duration-200 ${
                          syncingStudents.has(student._id)
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                        title="Sync Now"
                      >
                        <RefreshCw className={`h-4 w-4 ${syncingStudents.has(student._id) ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {student.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {student.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {student.codeforcesHandle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      Current: {student.currentRating || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Max: {student.maxRating || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {student.totalProblemsSolved || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {student.lastUpdated ? new Date(student.lastUpdated).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleReminders(student._id)}
                        className={student.emailRemindersEnabled ? 
                          "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" :
                          "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        }
                        title={student.emailRemindersEnabled ? "Disable reminders" : "Enable reminders"}
                      >
                        {student.emailRemindersEnabled ? 
                          <Mail className="h-4 w-4" /> : 
                          <MailX className="h-4 w-4" />
                        }
                      </button>
                      {student.reminderEmailCount > 0 && (
                        <div className="flex items-center space-x-1">
                          <Bell className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            {student.reminderEmailCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/student/${student._id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit Student"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Student"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No students found matching your search.' : 'No students found. Add your first student to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Student Form Modal */}
      {showModal && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard; 