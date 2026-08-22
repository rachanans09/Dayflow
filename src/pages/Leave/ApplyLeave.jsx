import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("Paid Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select start and end dates.");
    setLoading(true);
    try {
      await addDoc(collection(db, "leaves"), {
        leaveType,
        startDate,
        endDate,
        reason: reason || "No remarks provided",
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      setReason("");
      setStartDate("");
      setEndDate("");
      alert("Leave application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting leave request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#f8fafc" }}>
        📝 Apply for Leave
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Leave Type</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} style={inputStyle}>
            <option value="Paid Leave">Paid Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} required />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Reason / Remarks</label>
          <textarea
            rows="3"
            placeholder="Brief explanation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#1e293b",
  padding: "24px",
  borderRadius: "12px",
  color: "#f8fafc",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  color: "#94a3b8",
  fontWeight: "500",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#0f172a",
  color: "#f8fafc",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "8px",
};