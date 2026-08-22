import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) setRole(snap.data().role);
    };
    load();
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard ({role || "Employee"})</h2>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/profile">Profile</Link> |{" "}
        <Link to="/attendance">Attendance</Link> |{" "}
        <Link to="/apply-leave">Apply Leave</Link>
        {role === "HR" && <> | <Link to="/approve-leave">Approve Leave</Link></>}
      </nav>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### Step 2: Confirm `src/App.jsx` has the Profile Route
Double-check that your `src/App.jsx` includes the route for your profile page so the app knows where to go when you click it:

```jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import Attendance from "./pages/Attendance/Attendance";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import ApproveLeave from "./pages/Leave/ApproveLeave";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/approve-leave" element={<ApproveLeave />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
