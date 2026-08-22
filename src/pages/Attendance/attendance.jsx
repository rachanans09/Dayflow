import React, { useState, useEffect } from 'react';
import './Attendance.css';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const DUMMY_UID = "test-user-123";

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

      // Sort by Firestore timestamp seconds, fallback to document index order
      data.sort((a, b) => {
        const timeA = a.timestamp?.seconds || (a.timestamp?.toMillis ? a.timestamp.toMillis() / 1000 : 0);
        const timeB = b.timestamp?.seconds || (b.timestamp?.toMillis ? b.timestamp.toMillis() / 1000 : 0);
        return timeA - timeB;
      });

      setRecords(data);

      if (data.length > 0) {
        // Pick the last logged record in array
        const latest = data[data.length - 1];
        
        // Check string without case sensitivity or hyphen mismatch
        const isCheckIn = latest.type?.toLowerCase().includes('in');
        setStatus(isCheckIn ? 'Checked In' : 'Checked Out');
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
      const newStatus = type === 'Check-In' ? 'Checked In' : 'Checked Out';
      
      // Update UI state immediately for responsive feedback
      setStatus(newStatus);

      await addDoc(collection(db, "attendance"), {
        uid: user.uid,
        type: type,
        timestamp: serverTimestamp(),
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

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
          <h1 style={{ color: "#0f172a" }}>Attendance Dashboard</h1>
<p style={{ color: "#475569" }}>Track your daily hours and verify working logs</p>
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
                      <span className={`tag ${r.type?.toLowerCase().includes('in') ? 'tag-in' : 'tag-out'}`}>
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