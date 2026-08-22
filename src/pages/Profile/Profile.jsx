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
        <p style={{ color: "#94a3b8" }}>Loading profile...</p>
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
      {/* Main Container mirroring the Dashboard screenshot */}
      <div style={{ 
        backgroundColor: "#080e1a", 
        color: "#ffffff",
        padding: "40px 32px", 
        borderRadius: "20px", 
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)", 
        width: "100%", 
        maxWidth: "520px",
        boxSizing: "border-box"
      }}>
        {/* Exact Header Style */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: "700", letterSpacing: "0.3px", color: "#ffffff" }}>Dayflow HRMS</h1>
          <p style={{ margin: "0", color: "#8a99ad", fontSize: "13px" }}>Employee Portal & Work Management</p>
        </div>

        {/* Top Badges / Navigation Tabs Style from Screenshot */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "32px", justifyContent: "center" }}>
          <div style={{ 
            backgroundColor: "#2563eb", 
            color: "#ffffff", 
            padding: "10px 18px", 
            borderRadius: "10px", 
            fontSize: "13px", 
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
          }}>
            <span style={{ width: "7px", height: "7px", backgroundColor: "#ffffff", borderRadius: "50%" }}></span>
            Profile Information
          </div>
          <div style={{ 
            backgroundColor: "#111c2e", 
            color: "#8a99ad", 
            padding: "10px 18px", 
            borderRadius: "10px", 
            fontSize: "13px", 
            fontWeight: "500",
            border: "1px solid #1e293b"
          }}>
            📄 Account Settings
          </div>
        </div>

        {/* Profile Card Box matching your aesthetic */}
        <div style={{ 
          backgroundColor: "#111c2e", 
          padding: "24px", 
          borderRadius: "16px", 
          marginBottom: "20px",
          border: "1px solid #1e293b"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "600", color: "#ffffff" }}>Employee Profile</h3>
              <p style={{ margin: "0", color: "#8a99ad", fontSize: "12px" }}>Manage your personal credentials and info</p>
            </div>
            <span style={{ 
              backgroundColor: "rgba(16, 185, 129, 0.12)", 
              color: "#34d399", 
              border: "1px solid rgba(16, 185, 129, 0.3)", 
              padding: "5px 12px", 
              borderRadius: "20px", 
              fontSize: "12px", 
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span style={{ width: "6px", height: "6px", backgroundColor: "#34d399", borderRadius: "50%" }}></span>
              Active Profile
            </span>
          </div>

          {/* User Identity Preview Banner */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "14px", 
            padding: "14px", 
            backgroundColor: "#0d1624", 
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #1a273b"
          }}>
            <div style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "50%", 
              backgroundColor: "#2563eb", 
              color: "#ffffff", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "20px", 
              fontWeight: "bold",
              flexShrink: 0 
            }}>
              {data.name ? data.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {data.name || "Unnamed Employee"}
              </div>
              <div style={{ fontSize: "12px", color: "#8a99ad", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {auth.currentUser?.email || "No email connected"}
              </div>
            </div>
          </div>

          {/* Input Fields Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
              {editing ? (
                <input
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Enter your name"
                />
              ) : (
                <div style={{ padding: "12px", backgroundColor: "#0d1624", borderRadius: "10px", color: "#ffffff", fontSize: "14px", border: "1px solid #1a273b" }}>
                  {data.name || "Not set"}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone Number</label>
              {editing ? (
                <input
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              ) : (
                <div style={{ padding: "12px", backgroundColor: "#0d1624", borderRadius: "10px", color: "#ffffff", fontSize: "14px", border: "1px solid #1a273b" }}>
                  {data.phone || "Not set"}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Address</label>
              {editing ? (
                <input
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  placeholder="Enter address"
                />
              ) : (
                <div style={{ padding: "12px", backgroundColor: "#0d1624", borderRadius: "10px", color: "#ffffff", fontSize: "14px", border: "1px solid #1a273b" }}>
                  {data.address || "Not set"}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Title (Admin-Managed)</label>
              <div style={{ padding: "12px", backgroundColor: "#080e1a", borderRadius: "10px", color: "#64748b", fontSize: "14px", border: "1px solid #1a273b" }}>
                {data.jobTitle || "Not assigned"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Area */}
        <div style={{ display: "flex", gap: "10px" }}>
          {editing ? (
            <>
              <button 
                onClick={save}
                style={{ flex: 1, backgroundColor: "#2563eb", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)" }}
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditing(false)}
                style={{ flex: 1, backgroundColor: "#1e293b", color: "#cbd5e1", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              style={{ width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)" }}
            >
              Edit Profile Information
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

 