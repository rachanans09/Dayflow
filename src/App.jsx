import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Profile from "./pages/Profile/Profile";
import AttendanceDashboard from "./pages/Attendance/attendance";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div style={layoutStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>Dayflow HRMS</h1>
        <p style={{ margin: "4px 0 20px 0", color: "#94a3b8" }}>
          Employee Portal & Work Management
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => setActiveTab("attendance")}
            style={tabButtonStyle(activeTab === "attendance")}
          >
            ● Attendance
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            style={tabButtonStyle(activeTab === "leave")}
          >
            📝 Leave Management
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {activeTab === "attendance" ? (
          <AttendanceDashboard />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <ApplyLeave />
            <ApproveLeave />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const layoutStyle = {
  backgroundColor: "#0f172a",
  color: "#f8fafc",
  minHeight: "100vh",
  padding: "40px 20px",
  boxSizing: "border-box",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "32px",
};

const tabButtonStyle = (isActive) => ({
  padding: "10px 24px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  backgroundColor: isActive ? "#2563eb" : "#1e293b",
  color: isActive ? "#ffffff" : "#94a3b8",
  transition: "all 0.2s ease",
});