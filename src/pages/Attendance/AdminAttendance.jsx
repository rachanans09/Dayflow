import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);

  const loadRecords = async () => {
    try {
      const snap = await getDocs(collection(db, "attendance"));
      setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading attendance records:", error);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "attendance", id), { status });
      loadRecords();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Employee Attendance</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {records.map((r) => (
          <li
            key={r.id}
            style={{
              marginBottom: "12px",
              padding: "12px",
              backgroundColor: "#1e293b",
              borderRadius: "8px",
            }}
          >
            <span>
              {r.uid} — {r.date} — Status: {r.status} — In: {r.checkIn} — Out:{" "}
              {r.checkOut || "-"}
            </span>{" "}
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <button onClick={() => setStatus(r.id, "Present")}>
                Mark Present
              </button>
              <button onClick={() => setStatus(r.id, "Absent")}>
                Mark Absent
              </button>
              <button onClick={() => setStatus(r.id, "Half-day")}>
                Mark Half-day
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}