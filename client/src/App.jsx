import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Register from "./pages/candidate/Register.jsx";
import Login from "./pages/candidate/Login.jsx";
import ForgotPassword from "./pages/candidate/ForgotPassword.jsx";
import ResetPassword from "./pages/candidate/ResetPassword.jsx";
import Dashboard from "./pages/candidate/Dashboard.jsx";
import Profile from "./pages/candidate/Profile.jsx";
import Documents from "./pages/candidate/Documents.jsx";
import RecruitmentStatus from "./pages/candidate/RecruitmentStatus.jsx";
import Interviews from "./pages/candidate/Interviews.jsx";
import Notifications from "./pages/candidate/Notifications.jsx";
import OfferLetter from "./pages/candidate/OfferLetter.jsx";
import FAQ from "./pages/candidate/FAQ.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/status"
        element={
          <ProtectedRoute>
            <RecruitmentStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <Interviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/offer"
        element={
          <ProtectedRoute>
            <OfferLetter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faq"
        element={
          <ProtectedRoute>
            <FAQ />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
