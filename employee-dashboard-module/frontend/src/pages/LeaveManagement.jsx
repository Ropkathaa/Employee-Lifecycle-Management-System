import React, { useState, useEffect, useMemo } from 'react';
import {
  FiPlus,
  FiSearch,
  FiX,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiUpload,
  FiFileText,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  LEAVE_TYPES,
  LEAVE_STATUS,
  LEAVE_TYPE_COLORS,
  FORMAT_DATE,
} from '../utils/constants';
import { classNames, truncateText } from '../utils/helpers';
import usePagination from '../hooks/usePagination';
import useDebounce from '../hooks/useDebounce';
import { employeeService } from '../services/employeeService';

// -------------------------------------------------------------------
// Status badge styles
// -------------------------------------------------------------------
const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  approved: 'bg-green-100 text-green-800 border border-green-200',
  rejected: 'bg-red-100 text-red-800 border border-red-200',
  cancelled: 'bg-gray-100 text-gray-800 border border-gray-200',
};

// -------------------------------------------------------------------
// Helper: compute number of days between two dates
// -------------------------------------------------------------------
const computeDays = (from, to) => {
  if (!from || !to) return 0;
  const f = new Date(from);
  const t = new Date(to);
  if (t < f) return 0;
  const diff = Math.ceil((t - f) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
};

// -------------------------------------------------------------------
// Sorting helpers
// -------------------------------------------------------------------
const getSortValue = (leave, field) => {
  switch (field) {
    case 'type':
      return leave.type;
    case 'fromDate':
      return leave.fromDate;
    case 'toDate':
      return leave.toDate;
    case 'numberOfDays':
      return leave.numberOfDays;
    case 'status':
      return leave.status;
    case 'appliedDate':
      return leave.appliedDate;
    case 'reason':
      return leave.reason;
    default:
      return leave.appliedDate;
  }
};

// ===================================================================
// LeaveManagement Component
// ===================================================================
const LeaveManagement = () => {
  // --------------- Modals ---------------
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // --------------- Form Data ---------------
  const initialFormState = {
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    medicalCertificate: null,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // --------------- Search & Filters ---------------
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRangeFrom, setDateRangeFrom] = useState('');
  const [dateRangeTo, setDateRangeTo] = useState('');

  // --------------- Sorting ---------------
  const [sortField, setSortField] = useState('appliedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // --------------- Leaves data (persisted via API) ---------------
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaves from backend on mount
  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const response = await employeeService.getLeaves();
        setLeaves(response.data?.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch leave requests');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  // --------------- Filtered + Sorted Data ---------------
  const processedLeaves = useMemo(() => {
    let result = [...leaves];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (l) =>
          l.employee.toLowerCase().includes(q) ||
          l.reason.toLowerCase().includes(q) ||
          l.type.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((l) => l.status === filterStatus);
    }

    // Leave type filter
    if (filterType !== 'all') {
      result = result.filter((l) => l.type === filterType);
    }

    // Date range filter (from)
    if (dateRangeFrom) {
      result = result.filter((l) => l.fromDate >= dateRangeFrom);
    }

    // Date range filter (to)
    if (dateRangeTo) {
      result = result.filter((l) => l.toDate <= dateRangeTo);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      const cmp = aVal - bVal;
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [leaves, debouncedSearch, filterStatus, filterType, dateRangeFrom, dateRangeTo, sortField, sortDirection]);

  // --------------- Pagination ---------------
  const itemsPerPage = 10;
  const { currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage } =
    usePagination(processedLeaves, itemsPerPage);

  // --------------- Summary stats ---------------
  const summary = useMemo(() => {
    const total = leaves.length;
    const approved = leaves.filter((l) => l.status === 'approved').length;
    const pending = leaves.filter((l) => l.status === 'pending').length;
    const rejected = leaves.filter((l) => l.status === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [leaves]);

  // --------------- Handlers ---------------
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <FiChevronUp className="w-3.5 h-3.5 inline-block ml-1" />
    ) : (
      <FiChevronDown className="w-3.5 h-3.5 inline-block ml-1" />
    );
  };

  const openApplyModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setShowApplyModal(true);
    setOpenMenuId(null);
  };

  const openViewModal = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
    setOpenMenuId(null);
  };

  const openEditModal = (leave) => {
    setSelectedLeave(leave);
    setFormData({
      leaveType: leave.type,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      reason: leave.reason,
      medicalCertificate: null,
    });
    setFormErrors({});
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const openCancelConfirm = (leave) => {
    setSelectedLeave(leave);
    setShowCancelConfirm(true);
    setOpenMenuId(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.leaveType) errors.leaveType = 'Please select a leave type';
    if (!formData.fromDate) errors.fromDate = 'Please select a from date';
    if (!formData.toDate) errors.toDate = 'Please select a to date';
    if (formData.fromDate && formData.toDate && formData.toDate < formData.fromDate) {
      errors.toDate = 'To date cannot be before from date';
    }
    if (!formData.reason.trim()) errors.reason = 'Please enter a reason';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyLeave = async () => {
    if (!validateForm()) return;

    const days = computeDays(formData.fromDate, formData.toDate);
    const newLeave = {
      employee: 'You',
      employeeId: '0',
      type: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      numberOfDays: days,
      reason: formData.reason,
      medicalCertificate: formData.medicalCertificate?.name || null,
    };

    try {
      const response = await employeeService.createLeave(newLeave);
      const createdLeave = response.data?.data;
      setLeaves((prev) => [createdLeave, ...prev]);
      setShowApplyModal(false);
      setFormData(initialFormState);
      toast.success('Leave request submitted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleEditLeave = async () => {
    if (!validateForm() || !selectedLeave) return;

    const days = computeDays(formData.fromDate, formData.toDate);
    const updatedData = {
      type: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      numberOfDays: days,
      reason: formData.reason,
      medicalCertificate: formData.medicalCertificate?.name || selectedLeave.medicalCertificate,
    };

    try {
      const response = await employeeService.updateLeave(selectedLeave._id, updatedData);
      const updatedLeave = response.data?.data;
      setLeaves((prev) =>
        prev.map((l) => (l._id === selectedLeave._id ? updatedLeave : l))
      );
      setShowEditModal(false);
      setSelectedLeave(null);
      setFormData(initialFormState);
      toast.success('Leave request updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update leave request');
    }
  };

  const handleCancelLeave = async () => {
    if (!selectedLeave) return;
    try {
      const response = await employeeService.cancelLeave(selectedLeave._id);
      const updatedLeave = response.data?.data;
      setLeaves((prev) =>
        prev.map((l) => (l._id === selectedLeave._id ? updatedLeave : l))
      );
      setShowCancelConfirm(false);
      setSelectedLeave(null);
      toast.success('Leave request cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel leave request');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, medicalCertificate: file }));
    }
  };

  // =================================================================
  // RENDER
  // =================================================================
  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Manage employee leave requests</p>
        </div>
        <button
          onClick={openApplyModal}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <FiPlus className="w-4 h-4" />
          Apply Leave
        </button>
      </div>

      {/* ---------- Summary Cards ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold mt-2 text-gray-900">{summary.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{summary.approved}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{summary.pending}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{summary.rejected}</p>
        </div>
      </div>

      {/* ---------- Search & Filters ---------- */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employee, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            {Object.values(LEAVE_STATUS).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {/* Leave Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            {Object.values(LEAVE_TYPES).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          {/* Date Range From */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={dateRangeFrom}
              onChange={(e) => setDateRangeFrom(e.target.value)}
              className="input-field pl-10"
              title="From date"
            />
          </div>

          {/* Date Range To */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={dateRangeTo}
              onChange={(e) => setDateRangeTo(e.target.value)}
              className="input-field pl-10"
              title="To date"
            />
          </div>
        </div>

        {/* Active filters indicator */}
        {(filterStatus !== 'all' || filterType !== 'all' || dateRangeFrom || dateRangeTo || debouncedSearch) && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <FiAlertCircle className="w-3.5 h-3.5" />
            <span>Filters active</span>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterType('all');
                setDateRangeFrom('');
                setDateRangeTo('');
                setSearchTerm('');
              }}
              className="text-primary-600 hover:text-primary-700 underline ml-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ---------- Leave History Table ---------- */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <Th sortable onClick={() => handleSort('type')}>
                  Leave Type <SortIcon field="type" />
                </Th>
                <Th sortable onClick={() => handleSort('fromDate')}>
                  From <SortIcon field="fromDate" />
                </Th>
                <Th sortable onClick={() => handleSort('toDate')}>
                  To <SortIcon field="toDate" />
                </Th>
                <Th sortable onClick={() => handleSort('numberOfDays')}>
                  Days <SortIcon field="numberOfDays" />
                </Th>
                <Th sortable onClick={() => handleSort('reason')}>
                  Reason <SortIcon field="reason" />
                </Th>
                <Th sortable onClick={() => handleSort('status')}>
                  Status <SortIcon field="status" />
                </Th>
                <Th sortable onClick={() => handleSort('appliedDate')}>
                  Applied Date <SortIcon field="appliedDate" />
                </Th>
                <Th className="relative">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="w-5 h-5 text-primary-600 animate-spin" />
                      <span>Loading leave requests...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                paginatedData.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                    {/* Leave Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={classNames(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          LEAVE_TYPE_COLORS[leave.type]
                        )}
                      >
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                      </span>
                    </td>

                    {/* From Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {FORMAT_DATE(leave.fromDate)}
                    </td>

                    {/* To Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {FORMAT_DATE(leave.toDate)}
                    </td>

                    {/* Number of Days */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[180px]">
                      <span title={leave.reason}>{truncateText(leave.reason, 30)}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={classNames(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          STATUS_STYLES[leave.status]
                        )}
                      >
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {FORMAT_DATE(leave.appliedDate)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === leave._id ? null : leave._id)
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiFileText className="w-4 h-4 text-gray-400" />
                      </button>

                      {openMenuId === leave._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                            <button
                              onClick={() => openViewModal(leave)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <FiEye className="w-4 h-4" /> View Details
                            </button>
                            {leave.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => openEditModal(leave)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <FiEdit2 className="w-4 h-4" /> Edit
                                </button>
                                <button
                                  onClick={() => openCancelConfirm(leave)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <FiTrash2 className="w-4 h-4" /> Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- Pagination ---------- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, processedLeaves.length)} of{' '}
              {processedLeaves.length} results
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

      {/* ================================================================ */}
      {/* APPLY LEAVE MODAL */}
      {/* ================================================================ */}
      {showApplyModal && (
        <ModalOverlay onClose={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <ModalHeader
              title="Apply for Leave"
              onClose={() => setShowApplyModal(false)}
            />
            <div className="p-6 space-y-5">
              {/* Leave Type */}
              <FormField label="Leave Type" error={formErrors.leaveType} required>
                <select
                  value={formData.leaveType}
                  onChange={(e) => handleFormChange('leaveType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select leave type</option>
                  {Object.entries(LEAVE_TYPES).map(([key, val]) => (
                    <option key={key} value={val}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* From Date */}
              <FormField label="From Date" error={formErrors.fromDate} required>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleFormChange('fromDate', e.target.value)}
                  className="input-field"
                />
              </FormField>

              {/* To Date */}
              <FormField label="To Date" error={formErrors.toDate} required>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleFormChange('toDate', e.target.value)}
                  className="input-field"
                />
              </FormField>

              {/* Auto-calculated Number of Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Days
                </label>
                <div className="input-field bg-gray-50 text-gray-500 cursor-not-allowed flex items-center">
                  {computeDays(formData.fromDate, formData.toDate)}{' '}
                  {computeDays(formData.fromDate, formData.toDate) === 1 ? 'day' : 'days'}
                </div>
              </div>

              {/* Reason */}
              <FormField label="Reason" error={formErrors.reason} required>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  className="input-field resize-none"
                  placeholder="Please provide a reason for your leave..."
                />
              </FormField>

              {/* Medical Certificate (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Certificate{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <FiUpload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Upload file</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.medicalCertificate && (
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {formData.medicalCertificate.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Accepted: PDF, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleApplyLeave} className="btn-primary">
                Submit Request
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ================================================================ */}
      {/* VIEW LEAVE MODAL */}
      {/* ================================================================ */}
      {showViewModal && selectedLeave && (
        <ModalOverlay onClose={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <ModalHeader
              title="Leave Details"
              onClose={() => setShowViewModal(false)}
            />
            <div className="p-6 space-y-4">
              <DetailRow label="Employee" value={selectedLeave.employee} />
              <DetailRow
                label="Leave Type"
                value={
                  <span
                    className={classNames(
                      'px-2.5 py-1 rounded-full text-xs font-medium inline-block',
                      LEAVE_TYPE_COLORS[selectedLeave.type]
                    )}
                  >
                    {selectedLeave.type.charAt(0).toUpperCase() + selectedLeave.type.slice(1)}
                  </span>
                }
              />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={classNames(
                      'px-2.5 py-1 rounded-full text-xs font-medium inline-block',
                      STATUS_STYLES[selectedLeave.status]
                    )}
                  >
                    {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                  </span>
                }
              />
              <DetailRow label="From Date" value={FORMAT_DATE(selectedLeave.fromDate)} />
              <DetailRow label="To Date" value={FORMAT_DATE(selectedLeave.toDate)} />
              <DetailRow
                label="Number of Days"
                value={`${selectedLeave.numberOfDays} ${selectedLeave.numberOfDays === 1 ? 'day' : 'days'}`}
              />
              <DetailRow label="Applied Date" value={FORMAT_DATE(selectedLeave.appliedDate)} />
              <DetailRow label="Reason" value={selectedLeave.reason} />
              {selectedLeave.medicalCertificate && (
                <DetailRow
                  label="Medical Certificate"
                  value={
                    <span className="flex items-center gap-1.5 text-primary-600">
                      <FiFileText className="w-4 h-4" />
                      {selectedLeave.medicalCertificate}
                    </span>
                  }
                />
              )}
            </div>
            <div className="flex justify-end px-6 pb-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ================================================================ */}
      {/* EDIT LEAVE MODAL */}
      {/* ================================================================ */}
      {showEditModal && selectedLeave && (
        <ModalOverlay onClose={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <ModalHeader
              title="Edit Leave Request"
              onClose={() => setShowEditModal(false)}
            />
            <div className="p-6 space-y-5">
              {/* Leave Type */}
              <FormField label="Leave Type" error={formErrors.leaveType} required>
                <select
                  value={formData.leaveType}
                  onChange={(e) => handleFormChange('leaveType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select leave type</option>
                  {Object.entries(LEAVE_TYPES).map(([key, val]) => (
                    <option key={key} value={val}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* From Date */}
              <FormField label="From Date" error={formErrors.fromDate} required>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleFormChange('fromDate', e.target.value)}
                  className="input-field"
                />
              </FormField>

              {/* To Date */}
              <FormField label="To Date" error={formErrors.toDate} required>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleFormChange('toDate', e.target.value)}
                  className="input-field"
                />
              </FormField>

              {/* Auto-calculated Number of Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Days
                </label>
                <div className="input-field bg-gray-50 text-gray-500 cursor-not-allowed flex items-center">
                  {computeDays(formData.fromDate, formData.toDate)}{' '}
                  {computeDays(formData.fromDate, formData.toDate) === 1 ? 'day' : 'days'}
                </div>
              </div>

              {/* Reason */}
              <FormField label="Reason" error={formErrors.reason} required>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  className="input-field resize-none"
                  placeholder="Please provide a reason for your leave..."
                />
              </FormField>

              {/* Medical Certificate (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Certificate{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <FiUpload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Upload file</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {(formData.medicalCertificate || selectedLeave.medicalCertificate) && (
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {formData.medicalCertificate
                        ? formData.medicalCertificate.name
                        : selectedLeave.medicalCertificate}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Accepted: PDF, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleEditLeave} className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ================================================================ */}
      {/* CANCEL CONFIRMATION MODAL */}
      {/* ================================================================ */}
      {showCancelConfirm && selectedLeave && (
        <ModalOverlay onClose={() => setShowCancelConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cancel Leave Request
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to cancel this leave request?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {selectedLeave.type.charAt(0).toUpperCase() + selectedLeave.type.slice(1)}
                </p>
                <p>
                  <span className="font-medium">Dates:</span>{' '}
                  {FORMAT_DATE(selectedLeave.fromDate)} – {FORMAT_DATE(selectedLeave.toDate)}
                </p>
                <p>
                  <span className="font-medium">Days:</span>{' '}
                  {selectedLeave.numberOfDays}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="btn-secondary"
              >
                Keep Request
              </button>
              <button onClick={handleCancelLeave} className="btn-danger">
                Yes, Cancel
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

// ===================================================================
// Sub-components
// ===================================================================

const Th = ({ children, sortable, onClick, className }) => (
  <th
    className={classNames(
      'text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider',
      sortable && 'cursor-pointer select-none hover:text-gray-700',
      className
    )}
    onClick={sortable ? onClick : undefined}
  >
    {children}
  </th>
);

const ModalOverlay = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <button
      onClick={onClose}
      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <FiX className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">
      {label}
    </span>
    <span className="text-sm text-gray-900 break-words">
      {value}
    </span>
  </div>
);

export default LeaveManagement;

