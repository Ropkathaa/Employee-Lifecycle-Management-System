import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const { data } = await api.post("/forgot-password", { email });
      setMessage(data.message);
      if (data.resetToken) setDevToken(data.resetToken); // demo only
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white shadow-sm rounded-xl p-8 border border-slate-100">
        <h1 className="text-2xl font-bold text-brand-700 mb-1">Reset Password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your registered email and we'll help you reset your password.
        </p>

        {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-md">{message}</p>}
        {devToken && (
          <p className="mb-4 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md break-all">
            Demo reset token (would normally be emailed):{" "}
            <Link to={`/reset-password/${devToken}`} className="underline font-medium">
              {devToken}
            </Link>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          <Link to="/login" className="text-brand-600 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
