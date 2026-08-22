import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Card, Button, Badge, Spinner, EmptyState } from "../../components/ui";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const loadData = async () => {
    try {
      // 1. Fetch user accounts & profile mappings
      const usersSnap = await getDocs(collection(db, "users"));
      const profilesSnap = await getDocs(collection(db, "profiles"));

      const profileLookup = {};
      profilesSnap.docs.forEach((d) => {
        profileLookup[d.id] = d.data();
      });

      const userLookup = {};
      usersSnap.docs.forEach((d) => {
        const uData = d.data();
        const pData = profileLookup[d.id] || {};
        userLookup[d.id] = {
          email: uData.email || "No email",
          empId: uData.empId || d.id,
          name: pData.name || uData.email?.split("@")[0] || "Employee",
          department: pData.department || "Engineering",
        };
      });
      setUserMap(userLookup);

      // 2. Fetch all attendance logs
      const snap = await getDocs(collection(db, "attendance"));
      const logs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Sort descending by date/time
      logs.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setRecords(logs);
    } catch (error) {
      console.error("Error loading records:", error);
      toast.error("Failed to load attendance logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const setStatus = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await updateDoc(doc(db, "attendance", id), { status });
      toast.success(`Marked as ${status}`);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Could not update attendance status.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredRecords = records.filter((r) => {
    const user = userMap[r.uid] || {};
    const matchesStatus = filterStatus === "All" || r.status === filterStatus;
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.empId && user.empId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.uid && r.uid.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const countPresent = records.filter((r) => r.status === "Present").length;
  const countAbsent = records.filter((r) => r.status === "Absent").length;
  const countHalfDay = records.filter((r) => r.status === "Half-day").length;

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Admin Attendance Control
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review organization-wide attendance logs, inspect punches, and override employee daily status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              HR Administration
            </span>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Total Entries</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {records.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-stack"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Marked Present</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {countPresent}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <i className="bi bi-person-check-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Marked Absent</p>
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {countAbsent}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
              <i className="bi bi-person-x-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Half-Day Sessions</p>
              <h3 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {countHalfDay}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center text-lg">
              <i className="bi bi-hourglass-split"></i>
            </div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <i className="bi bi-search absolute left-3.5 top-3 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search by employee name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {["All", "Present", "Absent", "Half-day", "Pending"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Master Attendance Record Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i className="bi bi-people-fill text-indigo-600 dark:text-indigo-400"></i>
              Employee Attendance Directory
            </h3>
            <span className="text-xs text-slate-400">
              Showing {filteredRecords.length} records
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : filteredRecords.length === 0 ? (
            <EmptyState text="No attendance logs found matching the filter." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Punch In / Out</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-center">Status Overrides</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredRecords.map((r) => {
                    const u = userMap[r.uid] || {
                      name: "Employee",
                      email: r.uid,
                      empId: r.uid,
                      department: "General",
                    };

                    const isUpdating = actionLoading[r.id];

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                {u.name}
                              </p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {r.date || "—"}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs">
                          <div className="space-y-0.5">
                            <div>
                              <span className="text-slate-400">In:</span>{" "}
                              <span className="text-slate-700 dark:text-slate-300">
                                {r.checkIn || r.time || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Out:</span>{" "}
                              <span className="text-slate-700 dark:text-slate-300">
                                {r.checkOut || "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge status={r.status || "Pending"} />
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => setStatus(r.id, "Present")}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                                r.status === "Present"
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => setStatus(r.id, "Absent")}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                                r.status === "Absent"
                                  ? "bg-rose-600 text-white border-rose-600"
                                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-500 hover:text-rose-600"
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => setStatus(r.id, "Half-day")}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                                r.status === "Half-day"
                                  ? "bg-sky-600 text-white border-sky-600"
                                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-500 hover:text-sky-600"
                              }`}
                            >
                              Half-day
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/attendance/${r.uid}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <span>Logs</span>
                            <i className="bi bi-arrow-right"></i>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}