import React from 'react';
import { FiUserCheck, FiBookOpen, FiFileText, FiAward, FiClock } from 'react-icons/fi';

const EVENT_ICON_MAP = {
  onboarding: FiUserCheck,
  training: FiBookOpen,
  document: FiFileText,
  status: FiAward,
  default: FiClock,
};

const EVENT_COLOR_MAP = {
  onboarding: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  training: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  document: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  status: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

/**
 * Reusable Employee Timeline component showing career milestones & activity log.
 */
export default function EmployeeTimeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <p className="text-xs text-slate-400 py-6 text-center">
        No recorded history events for this profile yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((evt, idx) => {
        const Icon = EVENT_ICON_MAP[evt.type] || EVENT_ICON_MAP.default;
        const colors = EVENT_COLOR_MAP[evt.type] || EVENT_COLOR_MAP.default;
        const isLast = idx === events.length - 1;

        return (
          <div key={evt.id || idx} className="flex gap-4 group">
            {/* Left Track Icon + Line */}
            <div className="flex flex-col items-center">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${colors} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={14} />
              </span>
              {!isLast && <div className="w-px flex-1 mt-2 mb-1 bg-slate-200 dark:bg-slate-700" />}
            </div>

            {/* Event Description */}
            <div className="pb-4 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {evt.title}
                </h4>
                <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">
                  {evt.date}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {evt.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
