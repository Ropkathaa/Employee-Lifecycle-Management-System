import { useEffect, useState } from "react";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const loadInterviews = () => {
    api.get("/interviews").then((res) => setInterviews(res.data));
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const submitReschedule = async (e, interviewId) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put(`/interviews/${interviewId}/reschedule`, { preferredDate, reason });
      setMessage("Reschedule request submitted to HR.");
      setRescheduleFor(null);
      setPreferredDate("");
      setReason("");
      loadInterviews();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit request.");
    }
  };

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Interview Schedule</h1>
      {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-md">{message}</p>}

      {interviews.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-slate-500">No interviews have been scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview._id} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{interview.round}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <HiOutlineCalendar />
                    {new Date(interview.scheduledDate).toLocaleString()} &middot; {interview.mode}
                  </p>
                  {interview.location && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <HiOutlineLocationMarker /> {interview.location}
                    </p>
                  )}
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {interview.status}
                </span>
              </div>

              {interview.status === "Scheduled" && (
                <div className="mt-4">
                  {rescheduleFor === interview._id ? (
                    <form
                      onSubmit={(e) => submitReschedule(e, interview._id)}
                      className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
                    >
                      <div>
                        <label className="text-sm font-medium text-slate-700">Preferred Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="text-sm font-medium text-slate-700">Reason</label>
                        <input
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setRescheduleFor(null)}
                        className="text-sm text-slate-500 px-3"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setRescheduleFor(interview._id)}
                      className="text-sm font-medium text-brand-600 hover:underline"
                    >
                      Request Reschedule
                    </button>
                  )}
                </div>
              )}

              {interview.rescheduleRequest?.requested && (
                <p className="mt-3 text-xs text-amber-700 bg-amber-50 inline-block px-3 py-1.5 rounded-md">
                  Reschedule request: {interview.rescheduleRequest.status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </CandidateLayout>
  );
}
