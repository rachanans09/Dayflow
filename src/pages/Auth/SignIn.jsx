import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Card, Button, Input } from "../../components/ui";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid credentials. Please verify email and password.");
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dayflow HRMS</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Every workday, perfectly aligned.</p>
        </div>

        <Card className="shadow-xl border-slate-200/80 dark:border-slate-750">
          <form onSubmit={handleSignIn} className="space-y-4">
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full py-2.5 mt-2 shadow-md shadow-indigo-200 dark:shadow-none" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign up here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}