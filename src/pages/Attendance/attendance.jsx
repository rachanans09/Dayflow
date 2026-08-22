import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const DUMMY_UID = "test-user-123"; // Temporary ID for unblocked development

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('Checked Out');

  const fetchAttendance = async () => {
    try {
      const q = query(collection(db, "attendance"), where("uid", "==", DUMMY_UID));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    await addDoc(collection(db, "attendance"), {
      uid: DUMMY_UID,
      type: "Check-In",
      timestamp: serverTimestamp(),
      date: new Date().toLocaleDateString()
    });
    setStatus('Checked In');
    fetchAttendance();
  };

  const handleCheckOut = async () => {
    await addDoc(collection(db, "attendance"), {
      uid: DUMMY_UID,
      type: "Check-Out",
      timestamp: serverTimestamp(),
      date: new Date().toLocaleDateString()
    });
    setStatus('Checked Out');
    fetchAttendance();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>Attendance Tracker</h2>
      <p>Status: <strong>{status}</strong></p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCheckIn} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>
          Check In
        </button>
        <button onClick={handleCheckOut} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Check Out
        </button>
      </div>

      <h3>Recent Attendance Log</h3>
      <ul>
        {records.map((r) => (
          <li key={r.id}>{r.type} - {r.date}</li>
        ))}
      </ul>
    </div>
  );
}