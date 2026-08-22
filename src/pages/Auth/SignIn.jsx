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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 mb-3 text-xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Dayflow HRMS</h1>
          <p className="text-sm text-slate-500 mt-1">Every workday, perfectly aligned.</p>
        </div>

        <Card>
          <form onSubmit={handleSignIn} className="space-y-3">
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
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-4 text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}