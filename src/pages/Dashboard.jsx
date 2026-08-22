import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!auth.currentUser) {
        navigate("/");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) {
    return <p style={{ color: "#64748b" }}>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-nav">
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Employee Portal</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Signed in as: <strong>{auth.currentUser?.email}</strong>{" "}
            <span className="badge">{role || "Employee"}</span>
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="grid-cards">
        <Link to="/profile" className="action-card">
          <h3>👤 My Profile</h3>
          <p>View and update personal info, contact, and job records.</p>
        </Link>

        <Link to="/attendance" className="action-card">
          <h3>⏱️ Attendance</h3>
          <p>Punch check-in/check-out and view your daily logs.</p>
        </Link>

        <Link to="/apply-leave" className="action-card">
          <h3>📅 Apply Leave</h3>
          <p>Submit time-off requests for paid or sick leaves.</p>
        </Link>

        {role === "HR" && (
          <Link to="/approve-leave" className="action-card" style={{ borderColor: "#818cf8" }}>
            <h3>📋 Approve Leaves</h3>
            <p>Review and approve pending team leave submissions.</p>
          </Link>
        )}
      </div>
    </div>
  );
}