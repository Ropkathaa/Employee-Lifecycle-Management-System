import React from 'react';
import { FiAward, FiDownload, FiEye } from 'react-icons/fi';
import { classNames } from '../utils/helpers';
import { TRAINING_STATUS } from '../utils/constants';

const CertificateBadge = ({ status, onView, onDownload }) => {
  const available = status === TRAINING_STATUS.COMPLETED;

  if (!available) {
    return (
      <div className="flex flex-col gap-1 items-start">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 inline-flex items-center gap-1.5">
          <FiAward className="w-3.5 h-3.5" />
          Not Earned
        </span>
        <span className="text-[11px] text-gray-400 max-w-[160px] leading-tight">
          Certificate will be available after successful completion.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onView}
        title="View Certificate"
        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
      >
        <FiEye className="w-4 h-4" />
      </button>
      <button
        onClick={onDownload}
        title="Download Certificate"
        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
      >
        <FiDownload className="w-4 h-4" />
      </button>
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
        Earned
      </span>
    </div>
  );
};

export default CertificateBadge;

