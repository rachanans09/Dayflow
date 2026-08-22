import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Card, PageContainer, Badge, Spinner } from "../components/ui";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [role, setRole] = useState("Employee");
  const [empName, setEmpName] = useState("");
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [todayPunches, setTodayPunches] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
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
        if (profileDoc.exists()) {
          setEmpName(profileDoc.data().name);
        }

        // Fetch Leave Metrics & Activity Feed
        const leavesSnap = await getDocs(
          userRole === "HR"
            ? query(collection(db, "leaves"), where("status", "==", "Pending"))
            : query(collection(db, "leaves"), where("uid", "==", user.uid))
        );
        setPendingLeaves(leavesSnap.docs.length);

        const activityItems = leavesSnap.docs.map((d) => ({
          id: d.id,
          text: `Leave request (${d.data().type || "General"})`,
          date: d.data().start || "Recent",
          status: d.data().status || "Pending",
        }));
        setRecentActivity(activityItems.slice(0, 4));

        // Fetch Today's Attendance Punches
        const todayStr = new Date().toISOString().split("T")[0];
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
      <Layout>
        <div className="w-full flex items-center justify-center min-h-[60vh]">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              Role: {role}
            </span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Today's Attendance
                </p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
                  {todayPunches > 0 ? `${todayPunches} Recorded` : "No punches yet"}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
                <i className="bi bi-clock-history"></i>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {role === "HR" ? "Pending Approvals" : "My Leave Requests"}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
                  {pendingLeaves} Requests
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
                <i className="bi bi-calendar-event"></i>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  System Connection
                </p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                  Active Live
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
                <i className="bi bi-shield-check"></i>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Navigation Action Tiles */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/attendance" className="group">
              <Card className="h-full border border-slate-200/80 dark:border-slate-700/80 group-hover:border-indigo-500 transition p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg mb-3">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Attendance Log
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Punch in/out and review timestamp records
                </p>
              </Card>
            </Link>

            <Link to="/apply-leave" className="group">
              <Card className="h-full border border-slate-200/80 dark:border-slate-700/80 group-hover:border-indigo-500 transition p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg mb-3">
                  <i className="bi bi-airplane"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Apply Leave
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Submit paid, sick, or casual leave requests
                </p>
              </Card>
            </Link>

            <Link to="/profile" className="group">
              <Card className="h-full border border-slate-200/80 dark:border-slate-700/80 group-hover:border-indigo-500 transition p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg mb-3">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  My Profile
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Update contact information and personal records
                </p>
              </Card>
            </Link>

            {role === "HR" ? (
              <Link to="/analytics" className="group">
                <Card className="h-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 group-hover:border-indigo-500 transition p-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg mb-3 shadow-md shadow-indigo-500/20">
                    <i className="bi bi-bar-chart"></i>
                  </div>
                  <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-300">
                    HR Analytics
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time attendance graphs and reports
                  </p>
                </Card>
              </Link>
            ) : (
              <Link to="/profile" className="group">
                <Card className="h-full border border-slate-200/80 dark:border-slate-700/80 group-hover:border-indigo-500 transition p-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg mb-3">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    Compensation
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review allowances, deductions, and net salary
                  </p>
                </Card>
              </Link>
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">
            Recent Workspace Activity
          </h2>
          {recentActivity.length === 0 ? (
            <Card className="py-8 text-center text-slate-400 text-sm">
              <i className="bi bi-activity text-2xl mb-1 block opacity-50"></i>
              No recent activity recorded.
            </Card>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <Card
                  key={item.id}
                  className="flex items-center justify-between py-3 px-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-sm">
                      <i className="bi bi-check2-circle"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.text}
                      </p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>
                  <Badge status={item.status} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}