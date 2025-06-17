import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon, Users, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import SettingsPage from './pages/SettingsPage';
import Leaderboard from './pages/Leaderboard';
import Navigation from './components/Navigation';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference or default to system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Student Progress Management
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-gray-900 dark:text-white" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-900 dark:text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <a
                href="/"
                className="flex items-center space-x-2 py-4 px-2 border-b-2 border-transparent hover:border-primary-500 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <Users className="h-5 w-5" />
                <span>Students</span>
              </a>
              <a
                href="/settings"
                className="flex items-center space-x-2 py-4 px-2 border-b-2 border-transparent hover:border-primary-500 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
