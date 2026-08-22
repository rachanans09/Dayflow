<<<<<<< HEAD


import AttendanceDashboard from "./pages/Attendance/attendance";
=======
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import Attendance from "./pages/Attendance/Attendance";
>>>>>>> 59cbfd6e06abea17940ec422d1a4766807885151
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

function App() {
  return (
<<<<<<< HEAD
    <div style={{ padding: "20px" }}>
      {/* Attendance Module */}
      <section style={{ marginBottom: "40px" }}>
        <AttendanceDashboard />
      </section>

      <hr style={{ border: "1px solid #334155", margin: "40px 0" }} />

      {/* Leave Management Modules */}
      <section style={{ marginBottom: "40px" }}>
        <ApplyLeave />
      </section>

      <section>
        <ApproveLeave />
      </section>
    </div>
=======
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/approve-leave" element={<ApproveLeave />} />
      </Routes>
    </BrowserRouter>
>>>>>>> 59cbfd6e06abea17940ec422d1a4766807885151
  );
}

export default App;
