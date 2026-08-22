import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Card, PageContainer, Button, Badge, Spinner } from "../components/ui";

export default function Dashboard() {
  const [role, setRole] = useState("Employee");
  const [empName, setEmpName] = useState("");
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [todayPunches, setTodayPunches] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch User Role & Profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : "Employee";
        setRole(userRole);

        const profileDoc = await getDoc(doc(db, "profiles", user.uid));
        if (profileDoc.exists()) setEmpName(profileDoc.data().name);

        // Fetch Metrics
        const leavesSnap = await getDocs(
          userRole === "HR"
            ? query(collection(db, "leaves"), where("status", "==", "Pending"))
            : query(collection(db, "leaves"), where("uid", "==", user.uid))
        );
        setPendingLeaves(leavesSnap.docs.length);

        const todayStr = new Date().toLocaleDateString();
        const punchSnap = await getDocs(
          query(collection(db, "attendance"), where("uid", "==", user.uid), where("date", "==", todayStr))
        );
        setTodayPunches(punchSnap.docs.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Welcome back, {empName || auth.currentUser?.email?.split("@")[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your daily workspace and real-time operational status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={role === "HR" ? "Present" : "Checked In"} />
          <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Role: {role}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Today's Activity</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
                {todayPunches > 0 ? `${todayPunches} Punches` : "No punches yet"}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 flex items-center justify-center text-lg">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {role === "HR" ? "Pending Approvals" : "My Leaves"}
              </p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
                {pendingLeaves} Requests
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-700 text-amber-600 flex items-center justify-center text-lg">
              <i className="bi bi-calendar-event"></i>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">System Link</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">Active Live</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 flex items-center justify-center text-lg">
              <i className="bi bi-shield-check"></i>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Quick Navigation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/attendance" className="group">
          <Card className="h-full border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition">
            <i className="bi bi-calendar-check text-2xl text-indigo-600 mb-2 block"></i>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition">
              Attendance Log
            </h4>
            <p className="text-xs text-slate-500 mt-1">Punch in/out and view timestamp records</p>
          </Card>
        </Link>

        <Link to="/apply-leave" className="group">
          <Card className="h-full border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition">
            <i className="bi bi-airplane text-2xl text-indigo-600 mb-2 block"></i>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition">
              Apply Leave
            </h4>
            <p className="text-xs text-slate-500 mt-1">Submit paid, sick, or casual leave requests</p>
          </Card>
        </Link>

        <Link to="/profile" className="group">
          <Card className="h-full border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition">
            <i className="bi bi-person-circle text-2xl text-indigo-600 mb-2 block"></i>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition">
              My Profile
            </h4>
            <p className="text-xs text-slate-500 mt-1">Update contact details and personal records</p>
          </Card>
        </Link>

        {role === "HR" && (
          <Link to="/analytics" className="group">
            <Card className="h-full border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition bg-indigo-50/50 dark:bg-indigo-950/20">
              <i className="bi bi-bar-chart text-2xl text-indigo-600 mb-2 block"></i>
              <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-300">
                HR Analytics
              </h4>
              <p className="text-xs text-slate-500 mt-1">Real-time attendance graphs and reports</p>
            </Card>
          </Link>
        )}
      </div>
    </PageContainer>
  );
}