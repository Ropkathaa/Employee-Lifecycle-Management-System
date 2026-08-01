import { useEffect, useState } from "react";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";

const STATUS_STYLES = {
  Applied: "bg-slate-100 text-slate-700",
  "Under Review": "bg-blue-50 text-blue-700",
  "Interview Scheduled": "bg-indigo-50 text-indigo-700",
  "Interview Completed": "bg-purple-50 text-purple-700",
  Selected: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  "Offer Extended": "bg-amber-50 text-amber-700",
  "Offer Accepted": "bg-emerald-50 text-emerald-700",
  "Offer Declined": "bg-rose-50 text-rose-700",
};

export default function RecruitmentStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get("/status").then((res) => setStatus(res.data));
  }, []);

  if (!status) {
    return (
      <CandidateLayout>
        <p className="text-slate-500">Loading status...</p>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Recruitment Status Tracking</h1>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm mb-6">
        <p className="text-sm text-slate-500 mb-2">Current Status</p>
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
            STATUS_STYLES[status.recruitmentStatus] || "bg-slate-100 text-slate-700"
          }`}
        >
          {status.recruitmentStatus}
        </span>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Application Timeline</h2>
        {status.recruitmentTimeline?.length ? (
          <ol className="relative border-l border-slate-200 ml-2">
            {status.recruitmentTimeline.map((item, idx) => (
              <li key={idx} className="mb-6 ml-4">
                <div className="absolute w-2.5 h-2.5 bg-brand-500 rounded-full -left-1.5 mt-1.5" />
                <time className="text-xs text-slate-400">{new Date(item.date).toLocaleString()}</time>
                <p className="text-sm font-medium text-slate-800">{item.stage}</p>
                {item.note && <p className="text-sm text-slate-500">{item.note}</p>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-500">No timeline events recorded yet.</p>
        )}
      </div>
    </CandidateLayout>
  );
}
