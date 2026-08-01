import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUser,
  HiOutlineDocumentAdd,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineBell,
  HiOutlineMailOpen,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { to: "/profile", label: "My Profile", icon: HiOutlineUser },
  { to: "/documents", label: "Documents", icon: HiOutlineDocumentAdd },
  { to: "/status", label: "Recruitment Status", icon: HiOutlineClipboardList },
  { to: "/interviews", label: "Interviews", icon: HiOutlineCalendar },
  { to: "/notifications", label: "Notifications", icon: HiOutlineBell },
  { to: "/offer", label: "Offer Letter", icon: HiOutlineMailOpen },
  { to: "/faq", label: "FAQ & Help", icon: HiOutlineQuestionMarkCircle },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100">
        <h1 className="text-lg font-bold text-brand-700">Candidate Portal</h1>
        <p className="text-xs text-slate-400">HR Automation System</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 border-t border-slate-100"
      >
        <HiOutlineLogout className="text-lg" />
        Logout
      </button>
    </aside>
  );
}
