import React, { useState } from 'react';
import { FiBell, FiLock, FiUser, FiGlobe, FiSave } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FiBell className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your account' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get a weekly summary of your activities' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
<div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings[item.key] ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[item.key] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FiLock className="w-5 h-5 text-primary-600" />
<h3 className="text-lg font-semibold dark:text-gray-100">Change Password</h3>
        </div>
        <div className="space-y-4">
          <div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input type="password" className="input-field" value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })} />
          </div>
          <div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input type="password" className="input-field" value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })} />
          </div>
          <div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input type="password" className="input-field" value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })} />
          </div>
          <button className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FiGlobe className="w-5 h-5 text-primary-600" />
<h3 className="text-lg font-semibold dark:text-gray-100">Preferences</h3>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
<p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Toggle dark mode for the dashboard</p>
          </div>
<button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isDark ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isDark ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

