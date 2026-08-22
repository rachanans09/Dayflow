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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "sans-serif" }}>
        <p style={{ color: "#6b7280" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f0f2f5", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{ 
        backgroundColor: "#0d1b2a", 
        color: "#ffffff",
        padding: "40px 30px", 
        borderRadius: "16px", 
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", 
        width: "100%", 
        maxWidth: "480px",
        boxSizing: "border-box"
      }}>
        {/* Header matching Dayflow HRMS theme */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold", letterSpacing: "0.5px" }}>Dayflow HRMS</h1>
          <p style={{ margin: "0", color: "#94a3b8", fontSize: "14px" }}>Employee Portal & Work Management</p>
        </div>

        {/* Profile Card Header */}
        <div style={{ 
          backgroundColor: "#1b263b", 
          padding: "20px", 
          borderRadius: "12px", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          border: "1px solid #334155"
        }}>
          <div style={{ 
            width: "55px", 
            height: "55px", 
            borderRadius: "50%", 
            backgroundColor: "#2563eb", 
            color: "#ffffff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "22px", 
            fontWeight: "bold",
            flexShrink: 0
          }}>
            {data.name ? data.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {data.name || "My Profile"}
            </h3>
            <p style={{ margin: "0", color: "#94a3b8", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {auth.currentUser?.email || "Not logged in"}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
            {editing ? (
              <input
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#1b263b", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your name"
              />
            ) : (
              <div style={{ padding: "12px", backgroundColor: "#1b263b", borderRadius: "8px", color: "#ffffff", fontSize: "14px", border: "1px solid #334155" }}>
                {data.name || "Not set"}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone Number</label>
            {editing ? (
              <input
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#1b263b", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            ) : (
              <div style={{ padding: "12px", backgroundColor: "#1b263b", borderRadius: "8px", color: "#ffffff", fontSize: "14px", border: "1px solid #334155" }}>
                {data.phone || "Not set"}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Address</label>
            {editing ? (
              <input
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#1b263b", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="Enter your address"
              />
            ) : (
              <div style={{ padding: "12px", backgroundColor: "#1b263b", borderRadius: "8px", color: "#ffffff", fontSize: "14px", border: "1px solid #334155" }}>
                {data.address || "Not set"}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Title (Admin-only)</label>
            <div style={{ padding: "12px", backgroundColor: "#152238", borderRadius: "8px", color: "#64748b", fontSize: "14px", border: "1px solid #2a3b55" }}>
              {data.jobTitle || "Not assigned"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
          {editing ? (
            <>
              <button 
                onClick={save}
                style={{ flex: 1, backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditing(false)}
                style={{ flex: 1, backgroundColor: "#334155", color: "#cbd5e1", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              style={{ width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

 