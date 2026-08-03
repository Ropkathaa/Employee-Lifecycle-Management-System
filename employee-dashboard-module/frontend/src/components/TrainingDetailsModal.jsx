import React, { useEffect, useState } from 'react';
import {
  FiX,
  FiLoader,
  FiUser,
  FiCalendar,
  FiClock,
  FiMonitor,
  FiMapPin,
  FiBookOpen,
  FiTarget,
  FiLayers,
  FiAward,
  FiCheckCircle,
  FiDownload,
} from 'react-icons/fi';
import { FORMAT_DATE, TRAINING_MODE_LABELS, TRAINING_STATUS } from '../utils/constants';
import TrainingStatusBadge from './TrainingStatusBadge';
import TrainingProgressBar from './TrainingProgressBar';
import { employeeService } from '../services/employeeService';
import toast from 'react-hot-toast';
import { classNames } from '../utils/helpers';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 font-medium break-words">{value || '—'}</p>
    </div>
  </div>
);

const TrainingDetailsModal = ({ training, onClose }) => {
  const [certificate, setCertificate] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);

  useEffect(() => {
    if (!training || training.effectiveStatus !== TRAINING_STATUS.COMPLETED) return;
    const load = async () => {
      setLoadingCert(true);
      try {
        const res = await employeeService.getTrainingCertificate(training._id);
        setCertificate(res.data?.data || null);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load certificate');
      } finally {
        setLoadingCert(false);
      }
    };
    load();
  }, [training]);

  if (!training) return null;

  const status = training.effectiveStatus || training.status;
  const modeLabel = TRAINING_MODE_LABELS[training.trainingMode] || training.trainingMode || '—';
  const completed = status === TRAINING_STATUS.COMPLETED;

  const downloadCertificate = () => {
    if (!certificate) return;
    const content = `CERTIFICATE OF COMPLETION\n\nThis certifies that you have successfully completed\n\n${training.courseName}\n\nTrainer: ${training.trainerName}\nDuration: ${training.durationDays} days\nCertificate ID: ${certificate.certificateId}\nDate: ${FORMAT_DATE(certificate.completionDate)}\n\nCongratulations!`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${training.courseName}-Certificate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Certificate downloaded successfully.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden animate-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <FiBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{training.courseName}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{training.category || 'General'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/70 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status + Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TrainingStatusBadge status={status} />
            <TrainingProgressBar progress={training.progress} status={status} className="sm:max-w-[220px]" />
          </div>

          {/* Description */}
          {training.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{training.description}</p>
            </div>
          )}

          {/* Key details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Training Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem icon={FiUser} label="Trainer" value={training.trainerName} />
              <DetailItem icon={FiClock} label="Duration" value={`${training.durationDays} days`} />
              <DetailItem icon={FiCalendar} label="Assigned Date" value={FORMAT_DATE(training.assignedDate)} />
              <DetailItem icon={FiCalendar} label="Start Date" value={FORMAT_DATE(training.startDate)} />
              <DetailItem icon={FiCalendar} label="Due Date" value={FORMAT_DATE(training.dueDate)} />
              <DetailItem icon={FiMonitor} label="Attendance Mode" value={modeLabel} />
              {training.trainingMode === 'offline' && (
                <DetailItem icon={FiMapPin} label="Training City" value={training.trainingCity} />
              )}
            </div>
          </div>

          {/* Learning Objectives */}
          {training.learningObjectives?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FiTarget className="w-4 h-4 text-indigo-500" />
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {training.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <FiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modules */}
          {training.modules?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FiLayers className="w-4 h-4 text-indigo-500" />
                Modules
              </h3>
              <div className="space-y-2">
                {training.modules.map((m, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-800">
                      {i + 1}. {m.title || `Module ${i + 1}`}
                    </p>
                    {m.description && (
                      <p className="text-xs text-gray-500 mt-1">{m.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificate */}
          <div className={classNames(
            'rounded-xl border p-4',
            completed ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'
          )}>
            <div className="flex items-center gap-3 mb-2">
              <div className={classNames(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
              )}>
                <FiAward className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Certificate</h3>
            </div>

            {completed ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pl-11">
                <div className="flex-1">
                  {loadingCert ? (
                    <span className="text-xs text-gray-500 flex items-center gap-2">
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                      Loading certificate...
                    </span>
                  ) : certificate ? (
                    <p className="text-xs text-green-700">
                      Certificate ID: {certificate.certificateId} · Issued {FORMAT_DATE(certificate.completionDate)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Certificate is ready.</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
                  >
                    View Certificate
                  </button>
                  <button
                    onClick={downloadCertificate}
                    className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 pl-11">
                Certificate will be available after successful completion.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/60 flex items-center justify-end">
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailsModal;

