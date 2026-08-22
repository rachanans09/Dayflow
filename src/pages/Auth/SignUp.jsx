import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Card, Button, Input } from "../../components/ui";
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

      // Save user base role and identifiers
      await setDoc(doc(db, "users", cred.user.uid), {
        empId,
        email,
        role,
      });

      // Synchronize pre-onboarded profile details if configured
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
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-2xl shadow-lg shadow-indigo-500/25 dark:shadow-none mb-4 text-2xl">
            ⚡
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Get started with Dayflow HRMS
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/80 dark:border-slate-800 p-8">
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

            <div className="w-full mb-3 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 shadow-inner cursor-pointer"
              >
                <option value="Employee">Employee</option>
                <option value="HR">HR Administrator</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full py-3 mt-3 shadow-lg shadow-indigo-500/25 dark:shadow-none"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}