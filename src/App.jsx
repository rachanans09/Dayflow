import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AttendanceDashboard from "./pages/Attendance/attendance";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

function Dashboard() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <section style={{ marginBottom: "40px" }}>
        <AttendanceDashboard />
      </section>
      <hr style={{ border: "1px solid #334155", margin: "40px 0" }} />
      <section style={{ marginBottom: "40px" }}>
        <ApplyLeave />
      </section>
      <section>
        <ApproveLeave />
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}