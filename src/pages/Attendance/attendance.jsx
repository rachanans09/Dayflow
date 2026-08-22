import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import './Attendance.css';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('Checked Out');
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "attendance"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
      if (data.length > 0) {
        const latest = data[data.length - 1];
        setStatus(latest.type === "Check-In" ? "Checked In" : "Checked Out");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAction = async (type) => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "attendance"), {
        uid: user.uid,
        type: type,
        timestamp: serverTimestamp(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setStatus(type === "Check-In" ? "Checked In" : "Checked Out");
      await fetchAttendance();
    } catch (err) {
      console.error("Error logging attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-container">
      {/* Header Banner */}
      <header className="attendance-header">
        <div>
          <h1>Attendance Dashboard</h1>
          <p>Track your daily hours and verify working logs</p>
        </div>
        <div className={`status-badge ${status === 'Checked In' ? 'active' : 'inactive'}`}>
          <span className="dot"></span>
          {status}
        </div>
      </header>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-title">Today's Status</span>
          <span className="metric-value">{status}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Total Logs</span>
          <span className="metric-value">{records.length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Shift Type</span>
          <span className="metric-value">Standard (9 AM - 5 PM)</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="action-card">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button 
            onClick={() => handleAction('Check-In')} 
            disabled={loading || status === 'Checked In'}
            className="btn btn-primary"
          >
            Check In
          </button>
          <button 
            onClick={() => handleAction('Check-Out')} 
            disabled={loading || status === 'Checked Out'}
            className="btn btn-secondary"
          >
            Check Out
          </button>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="history-card">
        <h3>Recent Logs</h3>
        {records.length === 0 ? (
          <p className="empty-text">No attendance records found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.slice().reverse().map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className={`tag ${r.type === 'Check-In' ? 'tag-in' : 'tag-out'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td>{r.date}</td>
                    <td>{r.time || 'Recorded'}</td>
                    <td><span className="status-success">Verified</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}