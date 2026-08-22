import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";

export default function AttendanceDashboard() {
  const [status, setStatus] = useState("Checked Out");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedLogs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLogs(fetchedLogs);
          if (fetchedLogs.length > 0) {
            setStatus(fetchedLogs[0].type === "Check In" ? "Checked In" : "Checked Out");
          }
        },
        (error) => console.error("Firestore Error:", error)
      );
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleAttendance = async (actionType) => {
    console.log("Action triggered:", actionType);
    setLoading(true);
    try {
      await addDoc(collection(db, "attendance"), {
        type: actionType,
        timestamp: serverTimestamp(),
        timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        dateString: new Date().toLocaleDateString(),
      });
      setStatus(actionType === "Check In" ? "Checked In" : "Checked Out");
    } catch (err) {
      console.error("Firebase write error:", err);
      alert(`Firebase write failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardContainerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#f8fafc" }}>Attendance Dashboard</h1>
          <p style={{ color: "#94a3b8", margin: "4px 0 0 0", fontSize: "14px" }}>
            Track your daily hours and verify working logs
          </p>
        </div>
        <span style={badgeStyle(status)}>● {status}</span>
      </div>

      <div style={gridStyle}>
        <div style={tileStyle}>
          <span style={labelStyle}>TODAY'S STATUS</span>
          <h3 style={valueStyle}>{status}</h3>
        </div>
        <div style={tileStyle}>
          <span style={labelStyle}>TOTAL LOGS</span>
          <h3 style={valueStyle}>{logs.length}</h3>
        </div>
        <div style={tileStyle}>
          <span style={labelStyle}>SHIFT TYPE</span>
          <h3 style={valueStyle}>Standard (9 AM – 5 PM)</h3>
        </div>
      </div>

      <div style={{ ...tileStyle, marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#f8fafc", fontSize: "18px" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => handleAttendance("Check In")}
            disabled={loading}
            style={{
              ...primaryBtn,
              backgroundColor: "#2563eb",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Processing..." : "Check In"}
          </button>
          <button
            onClick={() => handleAttendance("Check Out")}
            disabled={loading}
            style={{
              ...primaryBtn,
              backgroundColor: "#334155",
              color: "#94a3b8",
              opacity: loading ? 0.7 : 1,
            }}
          >
            Check Out
          </button>
        </div>
      </div>

      <div style={tileStyle}>
        <h3 style={{ margin: "0 0 16px 0", color: "#f8fafc", fontSize: "18px" }}>Recent Logs</h3>
        {logs.length === 0 ? (
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>No attendance records found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {logs.map((log) => (
              <div key={log.id} style={logItemStyle}>
                <span style={{ fontWeight: "600", color: log.type === "Check In" ? "#4ade80" : "#fca5a5" }}>
                  {log.type}
                </span>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                  {log.timeString || "Just now"} ({log.dateString || ""})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardContainerStyle = {
  backgroundColor: "#0f172a",
  padding: "32px",
  borderRadius: "16px",
  maxWidth: "700px",
  margin: "0 auto",
  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const tileStyle = {
  backgroundColor: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #334155",
};

const labelStyle = {
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const valueStyle = {
  margin: "8px 0 0 0",
  color: "#f8fafc",
  fontSize: "20px",
  fontWeight: "600",
};

const primaryBtn = {
  flex: 1,
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const badgeStyle = (status) => ({
  padding: "6px 16px",
  borderRadius: "20px",
  fontWeight: "600",
  fontSize: "13px",
  backgroundColor: status === "Checked In" ? "rgba(74, 222, 128, 0.15)" : "rgba(248, 113, 113, 0.15)",
  color: status === "Checked In" ? "#4ade80" : "#fca5a5",
  border: `1px solid ${status === "Checked In" ? "rgba(74, 222, 128, 0.3)" : "rgba(248, 113, 113, 0.3)"}`,
});

const logItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  border: "1px solid #334155",
};