import React, { useEffect, useState, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employeeService';
import useDebounce from '../hooks/useDebounce';
import AttendanceSummaryCards from '../components/AttendanceSummaryCards';
import TodayAttendanceCard from '../components/TodayAttendanceCard';
import AttendanceFilters from '../components/AttendanceFilters';
import AttendanceHistoryTable from '../components/AttendanceHistoryTable';
import AttendanceCalendar from '../components/AttendanceCalendar';

const Attendance = () => {
  // --------------- Data ---------------
  const [summary, setSummary] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [todayData, setTodayData] = useState({ record: null });
  const [todayLoading, setTodayLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyPagination, setHistoryPagination] = useState({});
  const [loadingAction, setLoadingAction] = useState(false);

  // --------------- Filters ---------------
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [historyPage, setHistoryPage] = useState(1);
  const historyPageSize = 10;

  // --------------- Data fetching ---------------
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const response = await employeeService.getAttendance();
      setSummary(response.data?.data || {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch attendance summary');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchToday = useCallback(async () => {
    setTodayLoading(true);
    try {
      const response = await employeeService.getTodayAttendance();
      setTodayData(response.data?.data || {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch today\'s attendance');
    } finally {
      setTodayLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const params = {
        page: historyPage,
        limit: historyPageSize,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterMonth !== 'all') params.month = filterMonth;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await employeeService.getAttendanceHistory(params);
      setHistory(response.data?.data || []);
      setHistoryPagination(response.data?.pagination || {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch attendance history');
    } finally {
      setHistoryLoading(false);
    }
  }, [historyPage, debouncedSearch, filterMonth, filterStatus]);

  useEffect(() => {
    fetchSummary();
    fetchToday();
  }, [fetchSummary, fetchToday]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // --------------- Actions ---------------
  const handleCheckIn = async () => {
    setLoadingAction(true);
    try {
      const response = await employeeService.checkIn();
      toast.success(response.data?.message || 'Checked in successfully');
      await fetchToday();
      await fetchSummary();
      await fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check in');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCheckOut = async () => {
    setLoadingAction(true);
    try {
      const response = await employeeService.checkOut();
      toast.success(response.data?.message || 'Checked out successfully');
      await fetchToday();
      await fetchSummary();
      await fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check out');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchSummary(), fetchToday(), fetchHistory()]);
    toast.success('Attendance data refreshed');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterMonth('all');
    setFilterStatus('all');
    setHistoryPage(1);
  };

  const hasActiveFilters = Boolean(debouncedSearch) || filterMonth !== 'all' || filterStatus !== 'all';

  const handlePageChange = (page) => {
    if (page < 1) return;
    setHistoryPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --------------- Render ---------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">
            Track your daily attendance, working hours, and history
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-secondary flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Today's Attendance */}
      {todayLoading ? (
        <div className="card p-6 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-20 w-full bg-gray-200 rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="h-12 w-full bg-gray-200 rounded-lg" />
              <div className="h-12 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <TodayAttendanceCard
          record={todayData.record}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          loadingAction={loadingAction}
        />
      )}

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={summary} loading={summaryLoading} />

      {/* Filters + History */}
      <AttendanceFilters
        search={searchTerm}
        onSearchChange={setSearchTerm}
        month={filterMonth}
        onMonthChange={(m) => {
          setFilterMonth(m);
          setHistoryPage(1);
        }}
        status={filterStatus}
        onStatusChange={(s) => {
          setFilterStatus(s);
          setHistoryPage(1);
        }}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Complete record of your check-ins and check-outs
          </p>
        </div>
      </div>

      <AttendanceHistoryTable
        data={history}
        loading={historyLoading}
        pagination={historyPagination}
        onPageChange={handlePageChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Calendar */}
      <AttendanceCalendar records={history} />
    </div>
  );
};

export default Attendance;

