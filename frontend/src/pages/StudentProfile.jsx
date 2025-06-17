import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Trophy, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { studentAPI } from '../services/api';
import ContestHistory from '../components/ContestHistory';
import ProblemSolving from '../components/ProblemSolving';
import SubmissionHeatmap from '../components/SubmissionHeatmap';
import Achievements from '../components/Achievements';
import PerformanceChart from '../components/PerformanceChart';

function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const [studentResponse, profileResponse] = await Promise.all([
        studentAPI.getStudentById(id),
        studentAPI.getStudentProfile(id)
      ]);
      setStudent(studentResponse.data);
      setProfile(profileResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch student profile');
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncStudent = async () => {
    try {
      setSyncing(true);
      await studentAPI.syncStudent(id);
      await fetchStudentProfile(); // Refresh the data
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
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Student not found'}</p>
        <Link to="/" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {student.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Codeforces: {student.codeforcesHandle}
            </p>
          </div>
        </div>
        <button
          onClick={handleSyncStudent}
          disabled={syncing}
          className={`btn-secondary flex items-center space-x-2 ${
            syncing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Rating</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {student.currentRating || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Max Rating</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {student.maxRating || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.lastUpdated ? new Date(student.lastUpdated).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Reminders</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.emailRemindersEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        {/* New card for Total Problems Solved */}
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Problems Solved</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {student.totalProblemsSolved || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-900 dark:text-white">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="text-gray-900 dark:text-white">{student.phone}</p>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart studentId={id} />
        <Achievements studentId={id} />
      </div>

      {/* Contest History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Contest History
        </h2>
        <ContestHistory contests={profile?.contests || []} />
      </div>

      {/* Problem Solving */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Problem Solving
        </h2>
        <ProblemSolving problems={profile?.problems || []} />
      </div>

      {/* Submission Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Activity Heatmap
        </h2>
        <SubmissionHeatmap submissions={profile?.submissions || []} />
      </div>
    </div>
  );
}

export default StudentProfile; 