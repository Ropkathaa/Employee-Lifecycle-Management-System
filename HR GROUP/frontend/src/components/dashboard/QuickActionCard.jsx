import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUserPlus, FiFileText, FiBookOpen, FiBarChart2, FiArrowRight,
} from 'react-icons/fi';

const ICON_MAP = {
  'user-plus': FiUserPlus,
  'file-text': FiFileText,
  'graduation-cap': FiBookOpen,
  'bar-chart': FiBarChart2,
};

const COLOR_MAP = {
  primary: {
    icon: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    arrow: 'text-violet-600 dark:text-violet-400',
    hover: 'hover:border-violet-200 dark:hover:border-violet-700',
    glow: 'group-hover:bg-violet-50/60 dark:group-hover:bg-violet-900/10',
  },
  success: {
    icon: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    arrow: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:border-emerald-200 dark:hover:border-emerald-700',
    glow: 'group-hover:bg-emerald-50/60 dark:group-hover:bg-emerald-900/10',
  },
  warning: {
    icon: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    arrow: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:border-amber-200 dark:hover:border-amber-700',
    glow: 'group-hover:bg-amber-50/60 dark:group-hover:bg-amber-900/10',
  },
  violet: {
    icon: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    arrow: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:border-purple-200 dark:hover:border-purple-700',
    glow: 'group-hover:bg-purple-50/60 dark:group-hover:bg-purple-900/10',
  },
};

export default function QuickActionCard({ action }) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[action.icon] || FiFileText;
  const colors = COLOR_MAP[action.color] || COLOR_MAP.primary;

  return (
    <button
      onClick={() => navigate(action.route)}
      aria-label={action.label}
      className={`group relative w-full text-left bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700 rounded-xl p-5
        shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5
        ${colors.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden`}
    >
      <div className={`absolute inset-0 rounded-xl transition-colors duration-200 ${colors.glow}`} />
      <div className="relative z-10">
        <span className={`inline-flex p-2.5 rounded-lg mb-3 ${colors.icon} transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={20} />
        </span>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 tracking-tight">
          {action.label}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {action.description}
        </p>
      </div>
      <span className={`absolute bottom-4 right-4 transition-all duration-200 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 ${colors.arrow}`}>
        <FiArrowRight size={15} />
      </span>
    </button>
  );
}
