import React, { useEffect, useState } from 'react';
import {
  FiLogIn,
  FiLogOut,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiUserCheck,
  FiSun,
} from 'react-icons/fi';
import { OFFICE_START_TIME, FORMAT_TIME } from '../utils/constants';
import { classNames } from '../utils/helpers';
import AttendanceTimer from './AttendanceTimer';
import StatusBadge from './StatusBadge';

const TodayAttendanceCard = ({ record, onCheckIn, onCheckOut, loadingAction }) => {
  const [dateText, setDateText] = useState('');
  const [clockText, setClockText] = useState('');

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      setDateText(
        current.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setClockText(
        current.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkedIn = Boolean(record?.checkIn);
  const checkedOut = Boolean(record?.checkOut);
  const canCheckIn = !checkedIn && !checkedOut;
  const canCheckOut = checkedIn && !checkedOut;

  const statusInfo = () => {
    if (checkedOut) {
      const map = {
        present: {
          text: 'Full Day Completed',
          color: 'bg-green-100 text-green-700',
        },
        half_day: {
          text: 'Half Day Completed',
          color: 'bg-yellow-100 text-yellow-700',
        },
      };
      const entry = map[record?.status] || {
        text: 'Shift Completed',
        color: 'bg-red-100 text-red-700',
      };
      return { icon: FiCheckCircle, text: entry.text, color: entry.color };
    }
    if (checkedIn) {
      return {
        icon: FiClock,
        text: record.lateEntry ? 'Working — Late Entry' : 'Working — On Time',
        color: record.lateEntry
          ? 'bg-orange-100 text-orange-700'
          : 'bg-primary-100 text-primary-700',
      };
    }
    return {
      icon: FiUserCheck,
      text: 'Not Checked In Yet',
      color: 'bg-gray-100 text-gray-600',
    };
  };

  const info = statusInfo();
  const InfoIcon = info.icon;

  return (
    <div className="card overflow-hidden p-0">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Today's Attendance</h2>
          <p className="text-primary-100 text-sm mt-0.5 flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5" />
            {dateText}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono tabular-nums">{clockText}</p>
          <p className="text-primary-100 text-xs mt-0.5">Office Start {OFFICE_START_TIME}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: status + timer */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Attendance Status</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={classNames(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                      info.color
                    )}
                  >
                    <InfoIcon className="w-4 h-4" />
                    {info.text}
                  </span>
                  {record?.status && checkedOut && <StatusBadge status={record.status} />}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Working Hours</p>
                <div className="mt-1.5">
                  {checkedIn ? (
                    <AttendanceTimer startTime={record.checkIn} endTime={record.checkOut} />
                  ) : (
                    <span className="text-xl font-semibold text-gray-400">00h 00m 00s</span>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm">
                <FiLogIn className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Check In:</span>
                <span className="font-medium text-gray-800">
                  {checkedIn ? FORMAT_TIME(record.checkIn) : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiLogOut className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Check Out:</span>
                <span className="font-medium text-gray-800">
                  {checkedOut ? FORMAT_TIME(record.checkOut) : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiSun className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Late:</span>
                <span
                  className={classNames(
                    'font-medium',
                    record?.lateEntry ? 'text-orange-600' : 'text-green-600'
                  )}
                >
                  {record?.lateEntry ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-6 flex flex-col justify-center gap-3">
            <button
              onClick={onCheckIn}
              disabled={!canCheckIn || loadingAction}
              className={classNames(
                'btn-primary flex items-center justify-center gap-2 w-full py-3 text-base',
                !canCheckIn &&
                  'bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed'
              )}
            >
              <FiLogIn className="w-5 h-5" />
              Check In
            </button>
            <button
              onClick={onCheckOut}
              disabled={!canCheckOut || loadingAction}
              className={classNames(
                'flex items-center justify-center gap-2 w-full py-3 text-base font-medium rounded-lg transition-colors duration-200',
                canCheckOut
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <FiLogOut className="w-5 h-5" />
              Check Out
            </button>

            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
              <p>• Check In allowed once per day.</p>
              <p>• Check Out requires a prior Check In.</p>
              <p>• Working Hours auto-calculated on Check Out.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayAttendanceCard;

