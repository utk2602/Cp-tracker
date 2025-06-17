import { useState, useEffect } from 'react';
import { Bell, Clock, Database, Settings, RefreshCw } from 'lucide-react';
import { cronAPI } from '../services/api';

function SettingsPage() {
  const [settings, setSettings] = useState({
    schedule: '0 2 * * *',
    availableSchedules: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await cronAPI.getCronSettings();
      setSettings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await cronAPI.updateCronSettings({ schedule: settings.schedule });
      setMessage('Settings updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSync = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await cronAPI.triggerSync();
      setMessage('Manual sync triggered successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to trigger manual sync');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings.schedule) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure cron job settings and manage data synchronization.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Settings className="h-6 w-6 text-primary-500" />
          <span>Cron Job Settings</span>
        </h2>

        {/* Sync Cron Settings */}
        <div className="space-y-4">
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sync Schedule
            </label>
            <select
              id="schedule"
              name="schedule"
              value={settings.schedule}
              onChange={handleChange}
              className="input-field"
            >
              {settings.availableSchedules?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current schedule: <code className="font-mono">{settings.schedule}</code>
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Manual Sync Trigger */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
          <RefreshCw className="h-6 w-6 text-purple-500" />
          <span>Manual Data Synchronization</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Trigger a manual synchronization of Codeforces data for all students.
        </p>
        <button
          onClick={handleTriggerSync}
          className="btn-secondary flex items-center space-x-2"
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
          <span>{loading ? 'Syncing...' : 'Trigger Sync Now'}</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage; 