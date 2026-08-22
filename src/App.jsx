import { useState } from "react";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";
import Attendance from "./pages/Attendance/Attendance";

export default function App() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div className="dashboard-container">
      <header className="header" style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1>Dayflow HRMS</h1>
        <p>Employee Portal & Work Management</p>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
          <button 
            className="btn-primary" 
            style={{ opacity: activeTab === "attendance" ? 1 : 0.5, cursor: "pointer" }}
            onClick={() => setActiveTab("attendance")}
          >
            🕒 Attendance
          </button>
          <button 
            className="btn-primary" 
            style={{ opacity: activeTab === "leave" ? 1 : 0.5, cursor: "pointer" }}
            onClick={() => setActiveTab("leave")}
          >
            📝 Leave Management
          </button>
        </div>
      </header>

      {activeTab === "attendance" && <Attendance />}
      {activeTab === "leave" && (
        <>
          <ApplyLeave />
          <ApproveLeave />
        </>
      )}
    </div>
  );
}