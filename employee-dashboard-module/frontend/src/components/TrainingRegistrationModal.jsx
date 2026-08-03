import React, { useEffect, useState } from 'react';
import { FiX, FiLoader, FiMonitor, FiMapPin, FiAlertCircle, FiUser, FiBookOpen } from 'react-icons/fi';
import { TRAINING_MODE } from '../utils/constants';
import { classNames } from '../utils/helpers';
import { employeeService } from '../services/employeeService';
import toast from 'react-hot-toast';

const TrainingRegistrationModal = ({ training, onClose, onSuccess }) => {
  const [mode, setMode] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!training) return;
    const loadCities = async () => {
      try {
        const res = await employeeService.getTrainingCities();
        setCities((res.data?.data || []).map((c) => c.name));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load training cities');
      }
    };
    loadCities();
  }, [training]);

  if (!training) return null;

  const validate = () => {
    const next = {};
    if (!mode) next.mode = 'Please select the training mode.';
    if (mode === TRAINING_MODE.OFFLINE && !city) next.city = 'Please select a training city.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await employeeService.registerTraining(training._id, {
        mode,
        city: mode === TRAINING_MODE.OFFLINE ? city : undefined,
      });
      toast.success('Training registered successfully.');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-modal-overlay"
      onClick={() => !submitting && onClose?.()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Register for Training</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select your attendance preference</p>
          </div>
          <button
            onClick={() => !submitting && onClose?.()}
            className="p-1.5 rounded-lg hover:bg-white/70 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Training summary */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FiBookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{training.courseName}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <FiUser className="w-3 h-3" />
                  {training.trainerName || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode(TRAINING_MODE.ONLINE);
                  setErrors((prev) => ({ ...prev, mode: null }));
                }}
                className={classNames(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                  mode === TRAINING_MODE.ONLINE
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                )}
              >
                <FiMonitor className="w-6 h-6" />
                <span className="text-sm font-medium">Online</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode(TRAINING_MODE.OFFLINE);
                  setErrors((prev) => ({ ...prev, mode: null }));
                }}
                className={classNames(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                  mode === TRAINING_MODE.OFFLINE
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                )}
              >
                <FiMapPin className="w-6 h-6" />
                <span className="text-sm font-medium">Offline</span>
              </button>
            </div>
            {errors.mode && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <FiAlertCircle className="w-3.5 h-3.5" />
                {errors.mode}
              </p>
            )}
          </div>

          {/* Training City (Offline only) */}
          {mode === TRAINING_MODE.OFFLINE && (
            <div className="animate-fade-slide">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training City <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setErrors((prev) => ({ ...prev, city: null }));
                }}
                className="input-field"
                disabled={submitting}
              >
                <option value="">Select training city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <FiAlertCircle className="w-3.5 h-3.5" />
                  {errors.city}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                The city list is managed by HR and reflects available offline locations.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={() => !submitting && onClose?.()}
            className="btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting && <FiLoader className="w-4 h-4 animate-spin" />}
            {submitting ? 'Registering...' : 'Confirm Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingRegistrationModal;

