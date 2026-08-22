import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile() {
  const [data, setData] = useState({ name: "", phone: "", address: "", jobTitle: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "profiles", user.uid));
        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to save.");
    try {
      await setDoc(doc(db, "profiles", user.uid), data, { merge: true });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading profile...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>
      <p>
        <strong>Email:</strong> {auth.currentUser?.email || "Not logged in"}
      </p>
      <p>
        <strong>Name:</strong>{" "}
        {editing ? (
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        ) : (
          data.name || "Not set"
        )}
      </p>
      <p>
        <strong>Phone:</strong>{" "}
        {editing ? (
          <input
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        ) : (
          data.phone || "Not set"
        )}
      </p>
      <p>
        <strong>Address:</strong>{" "}
        {editing ? (
          <input
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        ) : (
          data.address || "Not set"
        )}
      </p>
      <p>
        <strong>Job Title:</strong> {data.jobTitle || "Not assigned"} (Admin-only field)
      </p>
      {editing ? (
        <button onClick={save}>Save</button>
      ) : (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
    </div>
  );
}
