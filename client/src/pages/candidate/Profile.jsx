import { useEffect, useState } from "react";
import CandidateLayout from "../../components/CandidateLayout.jsx";
import api from "../../api/axios";

export default function Profile() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwMessage, setPwMessage] = useState("");

  useEffect(() => {
    api.get("/profile").then((res) => {
      const data = res.data;
      setForm({
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
        gender: data.gender || "",
        appliedPosition: data.appliedPosition || "",
        experienceYears: data.experienceYears || 0,
        linkedIn: data.linkedIn || "",
      });
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.put("/profile", form);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMessage("");
    try {
      const { data } = await api.put("/change-password", pwForm);
      setPwMessage(data.message);
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwMessage(err.response?.data?.message || "Failed to change password.");
    }
  };

  if (!form) {
    return (
      <CandidateLayout>
        <p className="text-slate-500">Loading profile...</p>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Personal & Professional Information</h2>
        {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-md">{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Field label="Address" name="address" value={form.address} onChange={handleChange} full />
          <Field
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
          <div>
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <Field
            label="Position Applied For"
            name="appliedPosition"
            value={form.appliedPosition}
            onChange={handleChange}
          />
          <Field
            label="Years of Experience"
            name="experienceYears"
            type="number"
            value={form.experienceYears}
            onChange={handleChange}
          />
          <Field label="LinkedIn Profile" name="linkedIn" value={form.linkedIn} onChange={handleChange} full />

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        {pwMessage && (
          <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-md">{pwMessage}</p>
        )}
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="password"
            required
            placeholder="Current password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </CandidateLayout>
  );
}

function Field({ label, name, value, onChange, type = "text", full = false }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
