<<<<<<< HEAD
import AttendanceDashboard from "./pages/Attendance/attendance";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import Attendance from "./pages/Attendance/Attendance";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";
>>>>>>> 8c0564ae7376a1d05f10fded091d7458877662dc

function App() {
  return (
<<<<<<< HEAD
    <div>
      <AttendanceDashboard />
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
>>>>>>> 8c0564ae7376a1d05f10fded091d7458877662dc
  );
}

export default App;