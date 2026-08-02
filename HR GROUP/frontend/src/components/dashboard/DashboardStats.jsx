import React from 'react';
import {
  FiUsers, FiUserPlus, FiAlertCircle, FiBookOpen,
  FiTrendingUp, FiTrendingDown,
} from 'react-icons/fi';

const ICON_MAP = {
  users: FiUsers,
  'user-plus': FiUserPlus,
  'file-warning': FiAlertCircle,
  'book-open': FiBookOpen,
};

const COLOR_MAP = {
  primary: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    icon: 'text-violet-600 dark:text-violet-400',
    trend: 'text-violet-600 dark:text-violet-400',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    trend: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-600 dark:text-amber-400',
    trend: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    icon: 'text-rose-600 dark:text-rose-400',
    trend: 'text-rose-500 dark:text-rose-400',
  },
};

function StatCard({ stat }) {
  const Icon = ICON_MAP[stat.icon] || FiUsers;
  const colors = COLOR_MAP[stat.color] || COLOR_MAP.primary;
  const isUp = stat.trendDirection === 'up';
  const TrendIcon = isUp ? FiTrendingUp : FiTrendingDown;
  const trendColor = isUp
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-500 dark:text-rose-400';

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
          {stat.label}
        </p>
        <span className={`p-2 rounded-lg ${colors.bg} ${colors.icon} transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={17} />
        </span>
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
        {stat.value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{stat.subtitle}</p>
      <div className="flex items-center gap-1.5">
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendColor}`}>
          <TrendIcon size={12} />
          {stat.trend}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{stat.trendLabel}</span>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  );
}

export default function DashboardStats({ stats = [], isLoading = false }) {
  const items = isLoading ? Array(4).fill(null) : stats;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((stat, idx) =>
        isLoading ? <StatCardSkeleton key={idx} /> : <StatCard key={stat.id} stat={stat} />
      )}
    </div>
  );
}
