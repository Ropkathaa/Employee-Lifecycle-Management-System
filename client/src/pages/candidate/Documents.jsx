import { useEffect, useState } from "react";
import { HiOutlineUpload, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";

const RECRUITMENT_DOC_TYPES = [
  { value: "resume", label: "Resume / Curriculum Vitae (CV)" },
  { value: "experience_certificate", label: "Experience Certificate" },
  { value: "professional_certification", label: "Professional Certification" },
];

const ONBOARDING_DOC_TYPES = [
  { value: "government_id", label: "Government Identity Proof" },
  { value: "educational_certificate", label: "Educational Certificate" },
  { value: "photograph", label: "Passport-size Photograph" },
  { value: "other", label: "Other Document" },
];

export default function Documents() {
  const [docType, setDocType] = useState("resume");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [additionalRequests, setAdditionalRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [convertedToEmployee, setConvertedToEmployee] = useState(false);

  const loadDocuments = () => {
    api.get("/documents").then((res) => {
      setDocuments(res.data.documents || []);
      setAdditionalRequests(res.data.additionalDocumentsRequested || []);
    });
  };

  useEffect(() => {
    loadDocuments();
    api.get("/profile").then((res) => setConvertedToEmployee(res.data.convertedToEmployee));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please choose a file to upload.");

    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Document uploaded successfully.");
      setFile(null);
      loadDocuments();
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const availableTypes = convertedToEmployee
    ? [...RECRUITMENT_DOC_TYPES, ...ONBOARDING_DOC_TYPES]
    : RECRUITMENT_DOC_TYPES;

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Document Upload</h1>
      <p className="text-slate-500 mb-6">
        {convertedToEmployee
          ? "Stage 2: Please upload your onboarding documents."
          : "Stage 1: Please upload your recruitment documents (Resume, Experience & Certifications)."}
      </p>

      {additionalRequests.filter((r) => !r.fulfilled).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-amber-800 mb-1">Additional documents requested by HR:</p>
          <ul className="list-disc list-inside text-sm text-amber-700">
            {additionalRequests
              .filter((r) => !r.fulfilled)
              .map((r, idx) => (
                <li key={idx}>{r.description}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload a Document</h2>
        {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-md">{message}</p>}

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="w-full sm:w-64">
            <label className="text-sm font-medium text-slate-700">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              {availableTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:flex-1">
            <label className="text-sm font-medium text-slate-700">File (PDF, DOC, JPG, PNG — max 5MB)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-60"
          >
            <HiOutlineUpload />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-slate-500">No documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <li key={doc._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{doc.fileName}</p>
                  <p className="text-xs text-slate-400 capitalize">
                    {doc.docType.replaceAll("_", " ")} &middot; {doc.stage} stage &middot;{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                {doc.verified ? (
                  <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    <HiOutlineCheckCircle /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    <HiOutlineClock /> Pending Review
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </CandidateLayout>
  );
}
