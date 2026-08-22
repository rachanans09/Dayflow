import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import Attendance from "./pages/Attendance/Attendance";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

function App() {
  return (
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
  );
}

export default App;

