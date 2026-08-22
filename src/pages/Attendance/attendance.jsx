import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, addDoc, query, where, getDocs, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { Card, Button, Badge, Spinner, EmptyState } from "../../components/ui";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

export default function Attendance() {
  const { uid: paramUid } = useParams();
  const currentUid = auth.currentUser?.uid;
  const targetUid = paramUid || currentUid;
  const isAdminView = Boolean(paramUid && paramUid !== currentUid);

  const [records, setRecords] = useState([]);
  const [targetName, setTargetName] = useState("");
  const [status, setStatus] = useState("Checked Out");
  const [viewMode, setViewMode] = useState("all"); // "all" | "week"
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchAttendance = async () => {
    if (!targetUid) return;
    try {
      if (isAdminView) {
        const userDoc = await getDoc(doc(db, "users", targetUid));
        const profDoc = await getDoc(doc(db, "profiles", targetUid));
        setTargetName(profDoc.exists() ? profDoc.data().name : userDoc.exists() ? userDoc.data().email : "Employee");
      }

      const q = query(collection(db, "attendance"), where("uid", "==", targetUid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      setRecords(data);
      if (data.length > 0) {
        const latest = data[data.length - 1];
        setStatus(latest.type === "Check-In" || latest.status === "Present" ? "Checked In" : "Checked Out");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attendance records.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [targetUid]);

  const handleAction = async (type) => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date();
      await addDoc(collection(db, "attendance"), {
        uid: user.uid,
        type: type,
        status: type === "Check-In" ? "Present" : "Checked Out",
        timestamp: serverTimestamp(),
        date: today.toISOString().split("T")[0],
        time: today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setStatus(type === "Check-In" ? "Checked In" : "Checked Out");
      toast.success(`Successfully recorded: ${type}`);
      await fetchAttendance();
    } catch (err) {
      console.error(err);
      toast.error("Failed to log attendance.");
    } finally {
      setLoading(false);
    }
  };

  // Filter records for the last 7 days
  const filteredRecords = records.filter((r) => {
    if (viewMode === "all") return true;
    if (!r.date) return false;
    const recordDate = new Date(r.date);
    const diffTime = Math.abs(new Date() - recordDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {isAdminView ? `Attendance Log: ${targetName}` : "Attendance Logging"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAdminView
                ? "Reviewing real-time punch timestamps and verified check-in history for this account."
                : "Record check-in / check-out times and review punch history with real-time timestamps."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={status === "Checked In" ? "Present" : "Absent"} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              {status}
            </span>
          </div>
        </div>

        {/* Status Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Current Status
                </p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
                  {status}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
                <i className="bi bi-person-badge"></i>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Total Punches Logged
                </p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
                  {records.length} Records
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
                  Designated Shift
                </p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                  09:00 AM - 05:00 PM
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
                <i className="bi bi-calendar3"></i>
              </div>
            </div>
          </Card>
        </div>

        {/* Punch Controls for standard employee view */}
        {!isAdminView && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Daily Quick Actions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record your entry and exit time for today's work session.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleAction("Check-In")}
                  disabled={loading || status === "Checked In"}
                  className="px-6 py-2.5 shadow-lg shadow-indigo-500/20"
                >
                  <i className="bi bi-box-arrow-in-right text-base"></i>
                  Punch Check-In
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleAction("Check-Out")}
                  disabled={loading || status === "Checked Out"}
                  className="px-6 py-2.5"
                >
                  <i className="bi bi-box-arrow-right text-base"></i>
                  Punch Check-Out
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Punch History Data Table */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i className="bi bi-journal-text text-indigo-600 dark:text-indigo-400"></i>
              Attendance History Records
            </h3>

            {/* Daily vs Weekly Toggle View */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  viewMode === "all"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                All Records
              </button>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  viewMode === "week"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                This Week (7 Days)
              </button>
            </div>
          </div>

          {fetching ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : filteredRecords.length === 0 ? (
            <EmptyState
              text={
                viewMode === "week"
                  ? "No attendance entries recorded in the last 7 days."
                  : "No attendance entries recorded yet."
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredRecords
                    .slice()
                    .reverse()
                    .map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {r.type || "Check-In"}
                        </td>
                        <td className="py-3.5 px-4">{r.date || "—"}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{r.time || "—"}</td>
                        <td className="py-3.5 px-4">
                          <Badge status={r.status || (r.type === "Check-In" ? "Present" : "Absent")} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                            <i className="bi bi-shield-check"></i> Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}