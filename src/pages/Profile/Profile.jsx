import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const DUMMY_UID = "test-user-123";

export default function Profile() {
  const [data, setData] = useState({ name: "", phone: "", address: "", jobTitle: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "profiles", DUMMY_UID));
      if (snap.exists()) setData(snap.data());
    };
    load();
  }, []);

  const save = async () => {
    await setDoc(doc(db, "profiles", DUMMY_UID), data);
    setEditing(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>
      <p>Name: {editing ? <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} /> : data.name}</p>
      <p>Phone: {editing ? <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /> : data.phone}</p>
      <p>Address: {editing ? <input value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} /> : data.address}</p>
      <p>Job Title: {data.jobTitle} (Admin-only field)</p>
      {editing ? <button onClick={save}>Save</button> : <button onClick={() => setEditing(true)}>Edit</button>}
    </div>
  );
}