import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FiCheck, FiRefreshCw, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employeeService';
import { useNotifications } from '../context/NotificationContext';
import useDebounce from '../hooks/useDebounce';
import NotificationSummaryCards from '../components/NotificationSummaryCards';
import NotificationFilters from '../components/NotificationFilters';
import NotificationList from '../components/NotificationList';
import NotificationDetailsModal from '../components/NotificationDetailsModal';

const Notifications = () => {
  // --------------- Data ---------------
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [allNotifications, setAllNotifications] = useState([]);

  const { refreshUnread, handleMarkedAsRead, handleMarkedAllAsRead } = useNotifications();

  // --------------- Filters ---------------
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // --------------- Modal ---------------
  const [detailsNotification, setDetailsNotification] = useState(null);

  // --------------- Data fetching (server-side) ---------------
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (sort !== 'latest') params.sort = sort;

      const response = await employeeService.getNotifications(params);
      setNotifications(response.data?.data || []);
      setPagination(response.data?.pagination || {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filterCategory, filterPriority, filterStatus, sort]);

  // Fetch all notifications for summary cards (client-side computed)
  const fetchAllNotifications = useCallback(async () => {
    try {
      const response = await employeeService.getNotifications({ page: 1, limit: 1000 });
      setAllNotifications(response.data?.data || []);
    } catch (err) {
      // Silent - summary cards will just show 0
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  // --------------- Handlers ---------------
  const handleMarkRead = async (notification) => {
    if (notification.status === 'read') return;
    try {
      await employeeService.markNotificationAsRead(notification._id);
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, status: 'read', readAt: new Date().toISOString() } : n
        )
      );
      setAllNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, status: 'read', readAt: new Date().toISOString() } : n
        )
      );
      handleMarkedAsRead(true);
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await employeeService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read', readAt: new Date().toISOString() })));
      setAllNotifications((prev) => prev.map((n) => ({ ...n, status: 'read', readAt: new Date().toISOString() })));
      handleMarkedAllAsRead();
      toast.success(response.data?.message || 'All notifications marked as read');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (notification) => {
    try {
      await employeeService.deleteNotification(notification._id);
      setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
      setAllNotifications((prev) => prev.filter((n) => n._id !== notification._id));
      if (notification.status === 'unread') {
        handleMarkedAsRead(true);
      }
      toast.success('Notification deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchNotifications(), fetchAllNotifications(), refreshUnread()]);
    toast.success('Notifications refreshed');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterStatus('all');
    setSort('latest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    filterCategory !== 'all' ||
    filterPriority !== 'all' ||
    filterStatus !== 'all' ||
    sort !== 'latest';

  const unreadCount = useMemo(
    () => allNotifications.filter((n) => n.status === 'unread').length,
    [allNotifications]
  );

  const handlePageChange = (page) => {
    if (page < 1) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You are all caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <FiCheck className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
          <button onClick={handleRefresh} className="btn-secondary flex items-center gap-2 text-sm">
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <NotificationSummaryCards notifications={allNotifications} />

      {/* Filters */}
      <NotificationFilters
        search={searchTerm}
        onSearchChange={setSearchTerm}
        category={filterCategory}
        onCategoryChange={(c) => {
          setFilterCategory(c);
          setCurrentPage(1);
        }}
        priority={filterPriority}
        onPriorityChange={(p) => {
          setFilterPriority(p);
          setCurrentPage(1);
        }}
        status={filterStatus}
        onStatusChange={(s) => {
          setFilterStatus(s);
          setCurrentPage(1);
        }}
        sort={sort}
        onSortToggle={() => setSort((prev) => (prev === 'latest' ? 'oldest' : 'latest'))}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Notification List */}
      <NotificationList
        notifications={notifications}
        loading={loading}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
        onViewDetails={setDetailsNotification}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Details Modal */}
      <NotificationDetailsModal
        notification={detailsNotification}
        onClose={() => setDetailsNotification(null)}
        onAction={(n) => {
          if (n.status === 'unread') {
            handleMarkRead(n);
          }
        }}
      />
    </div>
  );
};

export default Notifications;

