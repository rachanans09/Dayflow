<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import Attendance from "./pages/Attendance/Attendance";
import Analytics from "./pages/Attendance/Analytics";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";
import OnboardEmployee from "./pages/Profile/OnboardEmployee";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated Dashboard Shell */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/apply-leave" element={<Layout><ApplyLeave /></Layout>} />
        <Route path="/approve-leave" element={<Layout><ApproveLeave /></Layout>} />
        <Route path="/onboard-employee" element={<Layout><OnboardEmployee /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
=======
import React from 'react';
import './App.css';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Profile />
      </main>
    </div>
  );
}

export default App;

>>>>>>> ef3f85338034776d29fe94672e31f6db312d3fea
