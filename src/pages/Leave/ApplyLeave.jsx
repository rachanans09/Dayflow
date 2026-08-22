import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("Paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select dates.");

    try {
      await addDoc(collection(db, "leaves"), {
        leaveType,
        startDate,
        endDate,
        reason,
        status: "Pending",
        createdAt: new Date(),
      });
      alert("Leave request submitted successfully!");
      setReason("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-title">📝 Apply for Leave</div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Leave Type</label>
            <select className="input-field" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
              <option value="Paid">Paid Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
            </select>
          </div>

          <div className="input-group">
            <label>Start Date</label>
            <input className="input-field" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="input-group">
            <label>End Date</label>
            <input className="input-field" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: "20px" }}>
          <label>Reason / Remarks</label>
          <input className="input-field" placeholder="Brief explanation..." value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>

        <button type="submit" className="btn-primary">Submit Application</button>
      </form>
    </div>
  );
}