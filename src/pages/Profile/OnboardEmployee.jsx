import { useState } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function OnboardEmployee() {
  const [empId, setEmpId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!empId) {
      alert("Please enter an Employee ID.");
      return;
    }
    try {
      await setDoc(doc(db, "onboarding", empId), {
        jobTitle, department, salary: Number(salary),
      });
      alert(`Employee ${empId} onboarded successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error onboarding employee.");
    }
  };

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
        backgroundColor: "#080e1a", 
        color: "#ffffff",
        padding: "40px 32px", 
        borderRadius: "20px", 
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)", 
        width: "100%", 
        maxWidth: "480px",
        boxSizing: "border-box"
      }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: "700", color: "#ffffff" }}>Dayflow HRMS</h1>
          <p style={{ margin: "0", color: "#8a99ad", fontSize: "13px" }}>Admin Portal - Employee Onboarding</p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase" }}>Employee ID</label>
            <input 
              placeholder="e.g., test-user-123" 
              value={empId} 
              onChange={(e) => setEmpId(e.target.value)} 
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase" }}>Job Title</label>
            <input 
              placeholder="e.g., Software Engineer" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)} 
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase" }}>Department</label>
            <input 
              placeholder="e.g., Engineering" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#8a99ad", marginBottom: "6px", textTransform: "uppercase" }}>Starting Salary</label>
            <input 
              placeholder="e.g., 75000" 
              type="number" 
              value={salary} 
              onChange={(e) => setSalary(e.target.value)} 
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0d1624", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)", marginTop: "10px" }}
          >
            Onboard Employee
          </button>
        </form>
      </div>
    </div>
  );
}
