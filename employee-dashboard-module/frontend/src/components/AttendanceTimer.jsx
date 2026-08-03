import React, { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { FORMAT_DURATION } from '../utils/constants';
import { classNames } from '../utils/helpers';

const AttendanceTimer = ({ startTime, endTime, className }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }

    const start = new Date(startTime).getTime();

    const update = () => {
      const end = endTime ? new Date(endTime).getTime() : Date.now();
      setElapsed(Math.max(0, end - start));
    };

    update();

    // Only tick when timer is running (no endTime)
    if (!endTime) {
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [startTime, endTime]);

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 font-mono text-xl font-semibold tabular-nums tracking-tight',
        endTime ? 'text-gray-800' : 'text-primary-600',
        className
      )}
    >
      <FiClock className="w-5 h-5" />
      <span>{FORMAT_DURATION(elapsed)}</span>
    </div>
  );
};

export default AttendanceTimer;

