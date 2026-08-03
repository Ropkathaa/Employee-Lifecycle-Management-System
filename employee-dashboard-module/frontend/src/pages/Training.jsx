import React, { useEffect, useMemo, useState } from 'react';
import {
  FiPlus,
  FiPlay,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAward,
  FiDownload,
  FiRefreshCw,
  FiBookOpen,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employeeService';
import { FORMAT_DATE, TRAINING_STATUS, TRAINING_MODE_LABELS, TRAINING_CATEGORIES } from '../utils/constants';
import { classNames } from '../utils/helpers';
import usePagination from '../hooks/usePagination';
import useDebounce from '../hooks/useDebounce';
import TrainingSummaryCards from '../components/TrainingSummaryCards';
import TrainingFilters from '../components/TrainingFilters';
import TrainingStatusBadge from '../components/TrainingStatusBadge';
import TrainingProgressBar from '../components/TrainingProgressBar';
import CertificateBadge from '../components/CertificateBadge';
import TrainingRegistrationModal from '../components/TrainingRegistrationModal';
import TrainingDetailsModal from '../components/TrainingDetailsModal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Training = () => {
  // --------------- Data ---------------
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------- Filters ---------------
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');

  // --------------- Modals ---------------
  const [registeringTraining, setRegisteringTraining] = useState(null);
  const [detailsTraining, setDetailsTraining] = useState(null);
  const [certificateTraining, setCertificateTraining] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getTrainings({ page: 1, limit: 1000 });
      setTrainings(response.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch trainings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const statusOf = (t) => t.effectiveStatus || t.status;

  // --------------- Processed data (search + filter + sort) ---------------
  const processedTrainings = useMemo(() => {
    let result = [...trainings];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t) => (t.courseName || '').toLowerCase().includes(q));
    }

    if (filterStatus !== 'all') {
      result = result.filter((t) => statusOf(t) === filterStatus);
    }

    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory);
    }

    result.sort((a, b) => {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    });

    return result;
  }, [trainings, debouncedSearch, filterStatus, filterCategory, sortOrder]);

  // --------------- Pagination (over processed/filtered data) ---------------
  const itemsPerPage = 8;
  const { currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage } =
    usePagination(processedTrainings, itemsPerPage);

  // --------------- Handlers ---------------
  const handleStartTraining = async (training) => {
    try {
      if (statusOf(training) === TRAINING_STATUS.PENDING) {
        toast.error('Please register for this training before starting.');
        return;
      }
      // Start / continue: set a baseline progress if currently registered
      const currentProgress = training.progress || 0;
      const nextProgress = currentProgress === 0 ? 25 : currentProgress;
      await employeeService.updateTrainingProgress(training._id, nextProgress);
      toast.success('Training started. Keep going!');
      fetchTrainings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start training');
    }
  };

  const handleContinueTraining = async (training) => {
    try {
      const next = Math.min(100, (training.progress || 0) + 25);
      await employeeService.updateTrainingProgress(training._id, next);
      toast.success(next >= 100 ? 'Training completed. Congratulations!' : 'Progress updated successfully.');
      fetchTrainings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const handleViewCertificate = async (training) => {
    setCertificateTraining(training);
    setCertificateLoading(true);
    try {
      await employeeService.getTrainingCertificate(training._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load certificate');
    } finally {
      setCertificateLoading(false);
    }
  };

  const handleDownloadCertificate = async (training) => {
    try {
      const res = await employeeService.getTrainingCertificate(training._id);
      const cert = res.data?.data;
      const content = `CERTIFICATE OF COMPLETION\n\nThis certifies that you have successfully completed\n\n${training.courseName}\n\nTrainer: ${training.trainerName}\nDuration: ${training.durationDays} days\nCertificate ID: ${cert?.certificateId || 'N/A'}\nDate: ${FORMAT_DATE(cert?.completionDate)}\n\nCongratulations!`;
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Certificate is not available yet.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
    setSortOrder('asc');
  };

  const hasActiveFilters = debouncedSearch || filterStatus !== 'all' || filterCategory !== 'all' || sortOrder !== 'asc';

  // --------------- Actions per status ---------------
  const renderActions = (training) => {
    const status = statusOf(training);

    if (status === TRAINING_STATUS.PENDING) {
      return (
        <button
          onClick={() => setRegisteringTraining(training)}
          className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
        >
          <FiPlus className="w-3.5 h-3.5" />
          Register
        </button>
      );
    }

    if (status === TRAINING_STATUS.REGISTERED) {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDetailsTraining(training)}
            title="View Details"
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStartTraining(training)}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <FiPlay className="w-3.5 h-3.5" />
            Start Training
          </button>
        </div>
      );
    }

    if (status === TRAINING_STATUS.IN_PROGRESS) {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDetailsTraining(training)}
            title="View Details"
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleContinueTraining(training)}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Continue Training
          </button>
        </div>
      );
    }

    if (status === TRAINING_STATUS.COMPLETED) {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDetailsTraining(training)}
            title="View Details"
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewCertificate(training)}
            title="View Certificate"
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
          >
            <FiAward className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDownloadCertificate(training)}
            title="Download Certificate"
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      );
    }

    // Overdue
    return (
      <button
        onClick={() => setDetailsTraining(training)}
        title="View Details"
        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        <FiEye className="w-4 h-4" />
      </button>
    );
  };

  // --------------- Table columns ---------------
  const columns = ['Course Name', 'Category', 'Trainer', 'Duration', 'Assigned', 'Due Date', 'Mode', 'City', 'Progress', 'Status', 'Certificate', ''];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training</h1>
          <p className="text-gray-500 mt-1">
            View and register for the trainings assigned by HR
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <TrainingSummaryCards trainings={trainings} />

      {/* Filters */}
      <TrainingFilters
        search={searchTerm}
        onSearchChange={setSearchTerm}
        status={filterStatus}
        onStatusChange={setFilterStatus}
        category={filterCategory}
        onCategoryChange={setFilterCategory}
        categories={TRAINING_CATEGORIES}
        sortOrder={sortOrder}
        onSortToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Training Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-10">
                    <div className="space-y-3">
                      <LoadingSkeleton className="h-8 w-full" />
                      <LoadingSkeleton className="h-8 w-full" />
                      <LoadingSkeleton className="h-8 w-full" />
                      <LoadingSkeleton className="h-8 w-full" />
                    </div>
                  </td>
                </tr>
              ) : processedTrainings.length === 0 ? (
                <tr>
                  <td colSpan={12}>
                    <EmptyState
                      title={trainings.length === 0 ? 'No trainings assigned yet' : 'No trainings match your filters'}
                      message={
                        trainings.length === 0
                          ? 'Trainings assigned by HR will appear here.'
                          : 'Try adjusting your search or filters.'
                      }
                      action={
                        hasActiveFilters ? (
                          <button onClick={clearFilters} className="btn-secondary text-sm">
                            Clear filters
                          </button>
                        ) : null
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((training) => {
                  const status = statusOf(training);
                  return (
                    <tr key={training._id} className="hover:bg-gray-50 transition-colors">
                      {/* Course Name */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className={classNames(
                            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                            status === TRAINING_STATUS.COMPLETED
                              ? 'bg-green-100 text-green-600'
                              : status === TRAINING_STATUS.IN_PROGRESS
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-blue-100 text-blue-600'
                          )}>
                            <FiBookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              {training.courseName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {training.category || 'General'}
                        </span>
                      </td>

                      {/* Trainer */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {training.trainerName || '—'}
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {training.durationDays ? `${training.durationDays} days` : '—'}
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {FORMAT_DATE(training.assignedDate)}
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {FORMAT_DATE(training.dueDate)}
                      </td>

                      {/* Mode */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={classNames(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          training.trainingMode === 'offline'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-sky-100 text-sky-700'
                        )}>
                          {TRAINING_MODE_LABELS[training.trainingMode] || '—'}
                        </span>
                      </td>

                      {/* City */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {training.trainingMode === 'offline'
                          ? training.trainingCity || '—'
                          : '—'}
                      </td>

                      {/* Progress */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <TrainingProgressBar progress={training.progress} status={status} showLabel={false} className="w-24" />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <TrainingStatusBadge status={status} />
                      </td>

                      {/* Certificate */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <CertificateBadge
                          status={status}
                          onView={() => handleViewCertificate(training)}
                          onDownload={() => handleDownloadCertificate(training)}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        {renderActions(training)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {processedTrainings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, processedTrainings.length)} of {processedTrainings.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={classNames(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TrainingRegistrationModal
        training={registeringTraining}
        onClose={() => setRegisteringTraining(null)}
        onSuccess={fetchTrainings}
      />
      <TrainingDetailsModal
        training={detailsTraining}
        onClose={() => setDetailsTraining(null)}
      />

      {/* Certificate loading overlay */}
      {certificateLoading && certificateTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3 shadow-xl">
            <FiLoader className="w-5 h-5 text-primary-600 animate-spin" />
            <span className="text-sm font-medium text-gray-700">Loading certificate...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;

