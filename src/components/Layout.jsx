import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Sidebar from "./Sidebar";
import "./sidebar.css";

export default function Layout({ children }) {
  const [role, setRole] = useState("");
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

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
    <div className="df-shell">
      <Sidebar role={role} userName={auth.currentUser?.email} onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {role === "HR" ? "Admin Console" : "Employee Portal"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              title="Toggle Dark Mode"
            >
              <i className={`bi ${isDark ? "bi-sun-fill text-amber-400" : "bi-moon-stars-fill text-indigo-600"}`}></i>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="df-content p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}