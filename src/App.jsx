import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Authentication
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Profile & Team Modules
import Profile from "./pages/Profile/Profile";
import AllEmployees from "./pages/Profile/AllEmployees";
import OnboardEmployee from "./pages/Profile/OnboardEmployee";

// Attendance & Analytics Modules (exact lowercase matching your filesystem)
import Attendance from "./pages/Attendance/attendance";
import AdminAttendance from "./pages/Attendance/AdminAttendance";
import Analytics from "./pages/Attendance/analytics";

// Leave Management Modules
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Core Workspace & Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Profile & Employee Directory Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/employee/:uid" element={<Profile />} />
        <Route path="/all-employees" element={<AllEmployees />} />

        {/* Attendance & HR Analytics Routes */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/:uid" element={<Attendance />} />
        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* Leave Management Routes */}
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/approve-leave" element={<ApproveLeave />} />

        {/* HR Administrative Onboarding */}
        <Route path="/onboard-employee" element={<OnboardEmployee />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}