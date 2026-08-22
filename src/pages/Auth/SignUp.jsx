import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empId, setEmpId] = useState("");
  const [role, setRole] = useState("Employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        empId,
        email,
        role,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-badge">⚡ Dayflow HRMS</span>
          <h2>Create Account</h2>
          <p>Get started by registering your employee credentials</p>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Employee ID</label>
            <input
              className="form-control"
              placeholder="e.g. EMP-104"
              value={empId}
              required
              onChange={(e) => setEmpId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Work Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="alex@company.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}