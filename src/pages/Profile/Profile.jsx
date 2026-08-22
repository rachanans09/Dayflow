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
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
        <p style={{ color: "#666" }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f4f6f9", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{ 
        backgroundColor: "#ffffff", 
        padding: "32px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", 
        width: "100%", 
        maxWidth: "450px" 
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ 
            width: "70px", 
            height: "70px", 
            borderRadius: "50%", 
            backgroundColor: "#e0e7ff", 
            color: "#4f46e5", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "28px", 
            fontWeight: "bold", 
            margin: "0 auto 12px auto" 
          }}>
            {data.name ? data.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 style={{ margin: "0 0 4px 0", color: "#1f2937" }}>My Profile</h2>
          <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>{auth.currentUser?.email || "Not logged in"}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Full Name</label>
            {editing ? (
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your name"
              />
            ) : (
              <div style={{ padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px", color: "#1f2937", fontSize: "14px", border: "1px solid #e5e7eb" }}>
                {data.name || "Not set"}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Phone Number</label>
            {editing ? (
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            ) : (
              <div style={{ padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px", color: "#1f2937", fontSize: "14px", border: "1px solid #e5e7eb" }}>
                {data.phone || "Not set"}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Address</label>
            {editing ? (
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="Enter your address"
              />
            ) : (
              <div style={{ padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px", color: "#1f2937", fontSize: "14px", border: "1px solid #e5e7eb" }}>
                {data.address || "Not set"}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Job Title (Admin-only field)</label>
            <div style={{ padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "6px", color: "#6b7280", fontSize: "14px", border: "1px solid #e5e7eb" }}>
              {data.jobTitle || "Not assigned"}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
          {editing ? (
            <>
              <button 
                onClick={save}
                style={{ flex: 1, backgroundColor: "#4f46e5", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditing(false)}
                style={{ flex: 1, backgroundColor: "#e5e7eb", color: "#374151", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              style={{ width: "100%", backgroundColor: "#4f46e5", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
