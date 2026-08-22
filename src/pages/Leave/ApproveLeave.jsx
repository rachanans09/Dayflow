
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function ApproveLeave() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "leaves"), (snapshot) => {
      setLeaves(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleStatus = async (id, status) => {
    await updateDoc(doc(db, "leaves", id), { status });
  };

  return (
    <div className="card">
      <div className="card-title">📋 Leave Requests</div>
      <div className="request-list">
        {leaves.length === 0 ? (
          <p style={{ color: "#64748b" }}>No leave requests submitted yet.</p>
        ) : (
          leaves.map((item) => (
            <div className="request-card" key={item.id}>
              <div>
                <strong style={{ fontSize: "1.05rem" }}>{item.leaveType} Leave</strong>
                <p style={{ margin: "4px 0", color: "#64748b", fontSize: "0.9rem" }}>
                  📅 {item.startDate} to {item.endDate}
                </p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155" }}>
                  <em>"{item.reason || "No remarks provided"}"</em>
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className={`badge badge-${item.status?.toLowerCase()}`}>
                  {item.status}
                </span>
                {item.status === "Pending" && (
                  <div>
                    <button className="btn-approve" onClick={() => handleStatus(item.id, "Approved")}>Approve</button>
                    <button className="btn-reject" onClick={() => handleStatus(item.id, "Rejected")}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}