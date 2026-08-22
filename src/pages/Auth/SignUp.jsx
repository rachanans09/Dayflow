import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Card, Button, Input, Select } from "../../components/ui";
import toast from "react-hot-toast";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empId, setEmpId] = useState("");
  const [role, setRole] = useState("Employee");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", cred.user.uid), {
        empId,
        email,
        role,
      });

      const onboardingSnap = await getDoc(doc(db, "onboarding", empId));
      if (onboardingSnap.exists()) {
        await setDoc(
          doc(db, "profiles", cred.user.uid),
          {
            ...onboardingSnap.data(),
            email,
          },
          { merge: true }
        );
      }

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-300 dark:shadow-none mb-4 text-2xl">
            ⚡
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Create Account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get started with Dayflow HRMS</p>
        </div>

        <Card className="shadow-xl border-slate-200/80 dark:border-slate-750">
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              label="Employee ID"
              placeholder="e.g. EMP-101"
              value={empId}
              required
              onChange={(e) => setEmpId(e.target.value)}
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="alex@dayflow.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select label="Account Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Employee">Employee</option>
              <option value="HR">HR Administrator</option>
            </Select>
            <Button type="submit" className="w-full py-2.5 mt-2 shadow-md shadow-indigo-200 dark:shadow-none" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}