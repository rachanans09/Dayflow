import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function ApproveLeave() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const snap = await getDocs(collection(db, "leaves"));
    setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await updateDoc(doc(db, "leaves", id), { status });
    load();
  };

  return (
    <div>
      <h2>Leave Requests</h2>
      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            {r.type} leave, {r.start} to {r.end} — {r.remarks} — Status: {r.status}
            {r.status === "Pending" && (
              <>
                {" "}
                <button onClick={() => setStatus(r.id, "Approved")}>Approve</button>
                <button onClick={() => setStatus(r.id, "Rejected")}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}