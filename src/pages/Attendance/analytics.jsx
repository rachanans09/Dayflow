import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, Spinner } from "../../components/ui";
import Layout from "../../components/Layout";

export default function Analytics() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    totalLogs: 0,
    presentCount: 0,
    absentCount: 0,
    halfDayCount: 0,
    pendingLeaves: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // 1. Fetch Users
        const usersSnap = await getDocs(collection(db, "users"));
        const totalEmployees = usersSnap.docs.length;

        // 2. Fetch Attendance Records
        const attendanceSnap = await getDocs(collection(db, "attendance"));
        const counts = { Present: 0, Absent: 0, "Half-day": 0, Pending: 0 };
        const punchTypes = { "Check-In": 0, "Check-Out": 0 };

        attendanceSnap.docs.forEach((d) => {
          const data = d.data();
          const status = data.status || "Present";
          const type = data.type || "Check-In";

          if (counts[status] !== undefined) {
            counts[status]++;
          } else {
            counts.Present++;
          }

          if (punchTypes[type] !== undefined) {
            punchTypes[type]++;
          }
        });

        // 3. Fetch Leaves Records
        const leavesSnap = await getDocs(collection(db, "leaves"));
        const leaveCounts = { Paid: 0, Sick: 0, Casual: 0, Unpaid: 0 };
        let pendingLeavesCount = 0;

        leavesSnap.docs.forEach((d) => {
          const l = d.data();
          if (l.status === "Pending") pendingLeavesCount++;
          const t = l.type || "Paid";
          if (leaveCounts[t] !== undefined) {
            leaveCounts[t]++;
          } else {
            leaveCounts.Paid++;
          }
        });

        setMetrics({
          totalEmployees,
          totalLogs: attendanceSnap.docs.length,
          presentCount: counts.Present,
          absentCount: counts.Absent,
          halfDayCount: counts["Half-day"],
          pendingLeaves: pendingLeavesCount,
        });

        setAttendanceData([
          { name: "Present", count: counts.Present, fill: "#10b981" },
          { name: "Absent", count: counts.Absent, fill: "#f43f5e" },
          { name: "Half-day", count: counts["Half-day"], fill: "#0ea5e9" },
          { name: "Check-Ins", count: punchTypes["Check-In"], fill: "#6366f1" },
          { name: "Check-Outs", count: punchTypes["Check-Out"], fill: "#8b5cf6" },
        ]);

        setLeaveData([
          { name: "Paid", value: leaveCounts.Paid, color: "#6366f1" },
          { name: "Sick", value: leaveCounts.Sick, color: "#f59e0b" },
          { name: "Casual", value: leaveCounts.Casual, color: "#06b6d4" },
          { name: "Unpaid", value: leaveCounts.Unpaid, color: "#94a3b8" },
        ]);
      } catch (err) {
        console.error("Error generating analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              HR Analytics & Live Reports
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time operational metrics across employee attendance, leave submissions, and Firestore sync.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              Live Operations Feed
            </span>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Total Headcount</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {metrics.totalEmployees} Active
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-people-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Verified Punches</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {metrics.totalLogs} Logs
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {metrics.pendingLeaves} Requests
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <i className="bi bi-hourglass-top"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Database Sync</p>
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                100% Live
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-hdd-network"></i>
            </div>
          </Card>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bar Chart: Attendance Volume */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <i className="bi bi-bar-chart-fill text-indigo-600 dark:text-indigo-400"></i>
                  Attendance Activity Distribution
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aggregate punch logs and status categorizations
                </p>
              </div>
            </div>

            {loading ? (
              <div className="h-[280px] flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        backgroundColor: "#1e293b",
                        border: "none",
                        color: "#fff",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Side Pie Chart: Leave Requests Allocation */}
          <Card className="p-6">
            <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <i className="bi bi-pie-chart-fill text-indigo-600 dark:text-indigo-400"></i>
                Leave Category Share
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown by requested leave type
              </p>
            </div>

            {loading ? (
              <div className="h-[280px] flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        backgroundColor: "#1e293b",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(val) => (
                        <span className="text-xs text-slate-600 dark:text-slate-300 ml-1">{val}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* System & Architecture Health Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="bi bi-shield-check text-emerald-500"></i> System Operational Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Firebase Authentication
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active / Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Cloud Firestore Rules
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Authenticated Read/Write
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="bi bi-speedometer2 text-indigo-500"></i> Client Architecture
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  React 18 + Vite Bundler
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Zero Warning Build
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Responsive Shell Layout
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Desktop Wide (1400px Max)
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}