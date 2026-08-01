import { useEffect, useState } from "react";
import { HiOutlineDownload, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";

export default function OfferLetter() {
  const [offer, setOffer] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    api
      .get("/offer")
      .then((res) => setOffer(res.data))
      .catch(() => setNotFound(true));
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (decision) => {
    setMessage("");
    try {
      const { data } = await api.put("/offer/decision", { decision });
      setMessage(
        decision === "Accepted"
          ? `Offer accepted! Your candidate dashboard has been converted to an employee dashboard. Employee ID: ${data.employeeId}`
          : "Offer declined. Thank you for your time."
      );
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to process your decision.");
    }
  };

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Offer Letter</h1>

      {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-md">{message}</p>}

      {notFound ? (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            No offer letter has been issued yet. This section will update once HR extends an offer.
          </p>
        </div>
      ) : offer ? (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">File</p>
          <p className="font-medium text-slate-800 mb-4">{offer.fileName}</p>

          <a
            href={`/${offer.filePath?.split("server/")[1] || offer.filePath}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline mb-6"
          >
            <HiOutlineDownload /> View / Download Offer Letter
          </a>

          <p className="text-sm text-slate-500 mb-4">
            Decision status: <span className="font-medium text-slate-800">{offer.decision}</span>
          </p>

          {offer.decision === "Pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => decide("Accepted")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
              >
                <HiOutlineCheck /> Accept Offer
              </button>
              <button
                onClick={() => decide("Declined")}
                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium px-5 py-2.5 rounded-lg"
              >
                <HiOutlineX /> Decline Offer
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-500">Loading...</p>
      )}
    </CandidateLayout>
  );
}
