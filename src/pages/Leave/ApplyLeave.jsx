import { useState } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("Paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select dates.");

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to apply for leave.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "leaves"), {
        uid: user.uid,
        userEmail: user.email,
        leaveType,
        startDate,
        endDate,
        reason,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      alert("Leave request submitted successfully!");
      setReason("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error("Error submitting leave request:", err);
      alert("Failed to submit leave request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "2rem auto", padding: "1.5rem" }}>
      <div className="card-title" style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
        📝 Apply for Leave
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Leave Type</label>
            <select
              className="input-field"
              style={{ width: "100%", padding: "0.5rem" }}
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="Paid">Paid Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
            </select>
          </div>

          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Start Date</label>
            <input
              className="input-field"
              style={{ width: "100%", padding: "0.5rem" }}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.25rem" }}>End Date</label>
            <input
              className="input-field"
              style={{ width: "100%", padding: "0.5rem" }}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Reason / Remarks</label>
            <input
              className="input-field"
              style={{ width: "100%", padding: "0.5rem" }}
              placeholder="Brief explanation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              padding: "0.75rem",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}