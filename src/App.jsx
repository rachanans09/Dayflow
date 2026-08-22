import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

export default function App() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dayflow HRMS</h1>
        <p>Manage employee leaves and request approvals seamlessly.</p>
      </header>

      <ApplyLeave />
      <ApproveLeave />
    </div>
  );
}