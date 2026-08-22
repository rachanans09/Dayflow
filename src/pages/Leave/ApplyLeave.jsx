import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Card, Button, Input, Badge, Spinner, EmptyState } from "../../components/ui";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

export default function ApplyLeave() {
  const [type, setType] = useState("Paid");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [fetching, setFetching] = useState(true);

  const loadMyLeaves = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "leaves"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.start || "").localeCompare(a.start || ""));
      setMyLeaves(list);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMyLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!start || !end) {
      toast.error("Please pick start and end dates.");
      return;
    }

    if (new Date(end) < new Date(start)) {
      toast.error("End date cannot be prior to start date.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("Session expired. Please log in.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "leaves"), {
        uid: user.uid,
        email: user.email,
        userEmail: user.email,
        type,
        start,
        end,
        remarks,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      toast.success("Leave application submitted!");
      setRemarks("");
      setStart("");
      setEnd("");
      loadMyLeaves();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = myLeaves.filter((l) => l.status === "Pending").length;
  const approvedCount = myLeaves.filter((l) => l.status === "Approved").length;

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Apply for Leave
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Submit formal time-off requests, monitor approval status, and view manager comments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              Standard Allowance
            </span>
          </div>
        </div>

        {/* Quick Leave Quota Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Total Applications</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {myLeaves.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-airplane-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Under Review</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {pendingCount} Pending
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <i className="bi bi-hourglass-split"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Approved Leaves</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {approvedCount} Approved
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Remaining Paid Leave</p>
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {Math.max(0, 18 - approvedCount)} Days
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-calendar2-week-fill"></i>
            </div>
          </Card>
        </div>

        {/* Form and Submission Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Form */}
          <Card className="lg:col-span-2 p-6 md:p-8">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              New Leave Application
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Leave Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 shadow-inner cursor-pointer"
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={start}
                  required
                  onChange={(e) => setStart(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={end}
                  required
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Reason & Handover Remarks
                </label>
                <textarea
                  placeholder="Provide context for the requested leave and any duty coverage notes..."
                  value={remarks}
                  required
                  rows={3}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 shadow-inner"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-2.5 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? "Submitting..." : "Submit Leave Application"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Right Policy Helper */}
          <Card className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-info-circle-fill"></i>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Leave Guidelines</h3>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <i className="bi bi-dot text-indigo-500 text-base"></i>
                <span>Submit paid leaves at least 3 business days in advance.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-dot text-indigo-500 text-base"></i>
                <span>Medical certificates are required for sick leave exceeding 2 consecutive days.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-dot text-indigo-500 text-base"></i>
                <span>HR reviews pending requests daily at 10:00 AM & 4:00 PM.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* History Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i className="bi bi-clock-history text-indigo-600 dark:text-indigo-400"></i>
              My Leave Application History
            </h3>
            <span className="text-xs text-slate-400">
              Showing {myLeaves.length} submitted requests
            </span>
          </div>

          {fetching ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : myLeaves.length === 0 ? (
            <EmptyState text="You have not submitted any leave applications yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">HR Feedback</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {myLeaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {leave.type} Leave
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {leave.start} <span className="text-slate-400">to</span> {leave.end}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[260px] truncate">
                        {leave.remarks || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs italic">
                        {leave.hrComment ? `"${leave.hrComment}"` : "No comment added"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge status={leave.status || "Pending"} />
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