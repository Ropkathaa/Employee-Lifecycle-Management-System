import React from 'react';
import { FiSun, FiCoffee, FiMoon } from 'react-icons/fi';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: FiSun, color: 'text-yellow-400' };
  if (hour < 17) return { text: 'Good Afternoon', icon: FiCoffee, color: 'text-orange-400' };
  return { text: 'Good Evening', icon: FiMoon, color: 'text-indigo-400' };
};

const WelcomeBanner = ({ employeeName }) => {
  const { text, icon: Icon, color } = getGreeting();
  const displayName = employeeName || 'Employee';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-6 md:p-8 text-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Icon className={`w-7 h-7 ${color}`} />
          <span className="text-primary-100 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mt-1">
          {text}, {displayName} 👋
        </h1>

        <p className="text-primary-100 text-base mt-2 max-w-xl">
          Welcome back! Hope you have a productive day.
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
