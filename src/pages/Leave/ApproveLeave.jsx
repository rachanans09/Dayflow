import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function ApproveLeave() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "leaves"), (snapshot) => {
      setLeaves(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleStatus = async (id, status) => {
    await updateDoc(doc(db, "leaves", id), { status });
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#f8fafc" }}>
        📋 Leave Requests
      </h2>
      {leaves.length === 0 ? (
        <p style={{ color: "#64748b", textAlign: "center" }}>No leave requests submitted yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {leaves.map((item) => (
            <div key={item.id} style={itemCardStyle}>
              <div>
                <span style={leaveBadgeStyle}>{item.leaveType || "Leave"}</span>
                <p style={{ margin: "8px 0 4px 0", color: "#e2e8f0", fontSize: "14px" }}>
                  📅 {item.startDate} to {item.endDate}
                </p>
                <p style={{ margin: "0", color: "#94a3b8", fontSize: "13px", italic: "true" }}>
                  "{item.reason || "No remarks provided"}"
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={getStatusStyle(item.status)}>{item.status || "Pending"}</span>
                {item.status === "Pending" && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => handleStatus(item.id, "Approved")} style={approveBtn}>
                      Approve
                    </button>
                    <button onClick={() => handleStatus(item.id, "Rejected")} style={rejectBtn}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  backgroundColor: "#1e293b",
  padding: "24px",
  borderRadius: "12px",
  color: "#f8fafc",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const itemCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  border: "1px solid #334155",
};

const leaveBadgeStyle = {
  fontWeight: "bold",
  color: "#38bdf8",
  fontSize: "15px",
};

const getStatusStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  backgroundColor: status === "Approved" ? "#166534" : status === "Rejected" ? "#991b1b" : "#854d0e",
  color: status === "Approved" ? "#4ade80" : status === "Rejected" ? "#fca5a5" : "#fef08a",
});

const approveBtn = {
  backgroundColor: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const rejectBtn = {
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};
