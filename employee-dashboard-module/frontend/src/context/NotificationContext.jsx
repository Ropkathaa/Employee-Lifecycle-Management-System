import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employeeService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const POLL_INTERVAL = 20000; // 20 seconds

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latest, setLatest] = useState(null);
  const lastTopIdRef = useRef(null);
  const firstLoadDoneRef = useRef(false);

  // Fetch the current unread count + latest notification (for badge + toast)
  const refreshUnread = useCallback(async (silent = false) => {
    try {
      const response = await employeeService.getNotifications({
        page: 1,
        limit: 1,
      });
      const data = response.data?.data || [];
      const pagination = response.data?.pagination || {};
      const total = pagination.total || 0;

      // Count unread in the full collection via total (filtered by status)
      const unreadResponse = await employeeService.getNotifications({
        page: 1,
        limit: 1,
        status: 'unread',
      });
      const unreadTotal = unreadResponse.data?.pagination?.total || 0;

      setUnreadCount(unreadTotal);

      const topNotification = data[0];
      if (topNotification) {
        const id = topNotification._id;
        if (
          firstLoadDoneRef.current &&
          lastTopIdRef.current &&
          lastTopIdRef.current !== id
        ) {
          setLatest(topNotification);
        }
        lastTopIdRef.current = id;
      }
      firstLoadDoneRef.current = true;
      return { total, unread: unreadTotal };
    } catch (err) {
      if (!silent) {
        console.error('Failed to refresh notification count:', err);
      }
      return { total: 0, unread: 0 };
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    refreshUnread(true);
    const interval = setInterval(() => {
      refreshUnread(true);
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshUnread]);

  // Show a toast whenever a brand-new notification arrives via polling
  useEffect(() => {
    if (latest) {
      toast(`🔔 ${latest.title}`, {
        duration: 4000,
        icon: null,
      });
    }
  }, [latest]);

  // Decrement local count after marking a notification read
  const handleMarkedAsRead = useCallback((wasUnread) => {
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  // Reset after marking all read
  const handleMarkedAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const value = {
    unreadCount,
    refreshUnread,
    handleMarkedAsRead,
    handleMarkedAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

