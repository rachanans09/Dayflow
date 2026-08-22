import AttendanceDashboard from "./pages/Attendance/attendance";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

function App() {
  return (
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
  );
}

export default App;