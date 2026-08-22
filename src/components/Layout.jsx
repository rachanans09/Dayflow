import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import "./sidebar.css";

export default function Layout({ children }) {
  const [role, setRole] = useState("");
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!auth.currentUser) return;
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) setRole(snap.data().role);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const logout = async () => {
    await signOut(auth);
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="df-shell">
      <Sidebar role={role} userName={auth.currentUser?.email} onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-6 flex justify-end items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm transition"
            title="Toggle theme"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>
        <main className="df-content overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}