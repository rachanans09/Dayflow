import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Dayflow HRMS - Leave Management</h1>
      <hr />
      <ApplyLeave />
      <hr />
      <ApproveLeave />
    </div>
  );
}