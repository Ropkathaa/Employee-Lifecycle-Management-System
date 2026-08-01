import { useEffect, useState } from "react";
import { HiOutlineBell, HiBell } from "react-icons/hi";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const load = () => api.get("/notifications").then((res) => setNotifications(res.data));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    load();
  };

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">HR Notifications</h1>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 p-6">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {n.read ? (
                  <HiBell className="text-slate-400 text-xl mt-0.5" />
                ) : (
                  <HiOutlineBell className="text-brand-600 text-xl mt-0.5" />
                )}
                <div>
                  <p className={`text-sm ${n.read ? "text-slate-500" : "text-slate-800 font-medium"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    From {n.sentBy} &middot; {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n._id)}
                  className="text-xs font-medium text-brand-600 hover:underline whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </CandidateLayout>
  );
}
