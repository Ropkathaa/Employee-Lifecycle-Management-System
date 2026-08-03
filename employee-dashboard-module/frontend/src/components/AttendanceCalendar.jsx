import React, { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ATTENDANCE_CALENDAR_COLORS } from '../utils/constants';
import { classNames } from '../utils/helpers';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LEGEND = [
  { key: 'present', label: 'Present', dot: 'bg-green-500' },
  { key: 'half_day', label: 'Half Day', dot: 'bg-yellow-500' },
  { key: 'absent', label: 'Absent', dot: 'bg-red-500' },
  { key: 'leave', label: 'Leave', dot: 'bg-blue-500' },
  { key: 'weekend', label: 'Weekend', dot: 'bg-gray-300' },
];

const AttendanceCalendar = ({ records = [] }) => {
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  const recordMap = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      if (r.date) map[r.date] = r;
    });
    return map;
  }, [records]);

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const arr = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) {
        arr.push(null);
        continue;
      }
      const date = new Date(viewYear, viewMonth, dayNum);
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dow = date.getDay();
      arr.push({
        day: dayNum,
        dateStr,
        isWeekend: dow === 0 || dow === 6,
        record: recordMap[dateStr] || null,
      });
    }
    return arr;
  }, [viewYear, viewMonth, recordMap]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const cellStyle = (cell) => {
    if (!cell) return '';
    if (cell.isWeekend) return ATTENDANCE_CALENDAR_COLORS.weekend;
    if (cell.record) {
      return ATTENDANCE_CALENDAR_COLORS[cell.record.status] || '';
    }
    return 'bg-white text-gray-700 border border-gray-200';
  };

  const cellBadge = (cell) => {
    if (!cell) return null;
    if (cell.isWeekend) return 'W';
    if (cell.record) {
      const map = {
        present: 'P',
        half_day: 'H',
        absent: 'A',
        leave: 'L',
        weekend: 'W',
      };
      return map[cell.record.status] || '—';
    }
    return String(cell.day);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Attendance Calendar</h3>
          <p className="text-sm text-gray-500 mt-0.5">Monthly attendance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[140px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={classNames(
              'aspect-square rounded-lg border flex flex-col items-center justify-center text-sm font-medium transition-all',
              cell && !cell.isWeekend && !cell.record
                ? 'hover:border-primary-300 hover:bg-primary-50'
                : '',
              cell ? cellStyle(cell) : 'bg-transparent border-transparent'
            )}
            title={
              cell?.record
                ? `${cell.dateStr} — ${cell.record.status.replace('_', ' ')}`
                : cell?.dateStr || ''
            }
          >
            {cellBadge(cell)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        {LEGEND.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={classNames('w-2.5 h-2.5 rounded-full', item.dot)} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;

