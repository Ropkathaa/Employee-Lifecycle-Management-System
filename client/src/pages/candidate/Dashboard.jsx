import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineDocumentAdd,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineMailOpen,
} from "react-icons/hi";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Dashboard() {
  const { candidate } = useAuth();
  const [status, setStatus] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    api.get("/status").then((res) => setStatus(res.data)).catch(() => {});
    api.get("/interviews").then((res) => setInterviews(res.data)).catch(() => {});
    api.get("/documents").then((res) => setDocuments(res.data.documents || [])).catch(() => {});
  }, []);

  const upcomingInterview = interviews.find((i) => i.status === "Scheduled");

  const cards = [
    {
      label: "Recruitment Status",
      value: status?.recruitmentStatus || "Loading...",
      icon: HiOutlineClipboardList,
      to: "/status",
    },
    {
      label: "Documents Uploaded",
      value: documents.length,
      icon: HiOutlineDocumentAdd,
      to: "/documents",
    },
    {
      label: "Upcoming Interview",
      value: upcomingInterview
        ? new Date(upcomingInterview.scheduledDate).toLocaleDateString()
        : "None scheduled",
      icon: HiOutlineCalendar,
      to: "/interviews",
    },
    {
      label: "Offer Letter",
      value: candidate?.recruitmentStatus?.includes("Offer") ? "Available" : "Not yet issued",
      icon: HiOutlineMailOpen,
      to: "/offer",
    },
  ];

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800">Welcome, {candidate?.fullName}</h1>
      <p className="text-slate-500 mt-1 mb-6">
        Here's an overview of your recruitment journey with us.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <Icon className="text-2xl text-brand-600 mb-2" />
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-lg font-semibold text-slate-800 mt-1">{value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recruitment Timeline</h2>
        {status?.recruitmentTimeline?.length ? (
          <ol className="relative border-l border-slate-200 ml-2">
            {status.recruitmentTimeline
              .slice()
              .reverse()
              .map((item, idx) => (
                <li key={idx} className="mb-6 ml-4">
                  <div className="absolute w-2.5 h-2.5 bg-brand-500 rounded-full -left-1.5 mt-1.5" />
                  <time className="text-xs text-slate-400">
                    {new Date(item.date).toLocaleString()}
                  </time>
                  <p className="text-sm font-medium text-slate-800">{item.stage}</p>
                  {item.note && <p className="text-sm text-slate-500">{item.note}</p>}
                </li>
              ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-500">No timeline events yet.</p>
        )}
      </div>
    </CandidateLayout>
  );
}
