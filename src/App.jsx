import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";

// Main Dashboard
import Dashboard from "./pages/Dashboard";

// Profile & Onboarding
import Profile from "./pages/Profile/Profile";
import OnboardEmployee from "./pages/Profile/OnboardEmployee";

// Attendance & Analytics
import Attendance from "./pages/Attendance/attendance";
import Analytics from "./pages/Attendance/Analytics";

// Leaves
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

// Layout Wrapper
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Authentication */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/apply-leave" element={<Layout><ApplyLeave /></Layout>} />
        <Route path="/approve-leave" element={<Layout><ApproveLeave /></Layout>} />
        <Route path="/onboard-employee" element={<Layout><OnboardEmployee /></Layout>} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}