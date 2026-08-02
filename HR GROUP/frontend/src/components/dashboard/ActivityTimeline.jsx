import React from 'react';
import {
  FiUserPlus, FiFileText, FiUpload, FiBookOpen,
  FiCheckCircle, FiActivity,
} from 'react-icons/fi';

const ICON_MAP = {
  'user-plus': FiUserPlus,
  'file-text': FiFileText,
  upload: FiUpload,
  'book-open': FiBookOpen,
  'check-circle': FiCheckCircle,
  default: FiActivity,
};

const COLOR_MAP = {
  primary: {
    icon: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    line: 'bg-violet-200 dark:bg-violet-800',
  },
  success: {
    icon: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    line: 'bg-emerald-200 dark:bg-emerald-800',
  },
  warning: {
    icon: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    line: 'bg-amber-200 dark:bg-amber-800',
  },
  violet: {
    icon: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    line: 'bg-purple-200 dark:bg-purple-800',
  },
};

function formatRelativeTime(iso) {
  const now = new Date();
  const then = new Date(iso);
  const diffMins = Math.floor((now - then) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function TimelineItem({ activity, isLast }) {
  const Icon = ICON_MAP[activity.icon] || ICON_MAP.default;
  const colors = COLOR_MAP[activity.color] || COLOR_MAP.primary;

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center">
        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colors.icon} transition-transform duration-150 group-hover:scale-105`}>
          <Icon size={14} />
        </span>
        {!isLast && <div className={`w-px flex-1 mt-2 mb-1 ${colors.line}`} />}
      </div>
      <div className={`pb-4 min-w-0`}>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            {activity.title}
          </p>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5 whitespace-nowrap">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {activity.description}
        </p>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
          by {activity.actor}
        </span>
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array(4).fill(null).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
          <div className="flex-1 pt-1 space-y-2">
            <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-2 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityTimeline({ activities = [], isLoading = false }) {
  if (isLoading) return <TimelineSkeleton />;
  return (
    <div className="space-y-0">
      {activities.map((activity, idx) => (
        <TimelineItem
          key={activity.id}
          activity={activity}
          isLast={idx === activities.length - 1}
        />
      ))}
    </div>
  );
}
