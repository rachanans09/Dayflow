import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Card, Button, Badge, Spinner, EmptyState } from "../../components/ui";
import Layout from "../../components/Layout";
import { sendLeaveStatusEmail } from "../../emailjs";
import toast from "react-hot-toast";

export default function ApproveLeave() {
  const [leaves, setLeaves] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [comments, setComments] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const fetchLeaveData = async () => {
    try {
      // 1. Fetch user accounts & profile mappings for employee names
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

      // 2. Fetch all leave applications
      const snap = await getDocs(collection(db, "leaves"));
      const leaveList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Sort descending by start date
      leaveList.sort((a, b) => (b.start || b.startDate || "").localeCompare(a.start || a.startDate || ""));
      setLeaves(leaveList);

      // Prepopulate comments state
      const initialComments = {};
      leaveList.forEach((item) => {
        if (item.hrComment) initialComments[item.id] = item.hrComment;
      });
      setComments(initialComments);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const updateStatus = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    const leaveItem = leaves.find((l) => l.id === id);
    const u = leaveItem ? userMap[leaveItem.uid] || {} : {};
    const recipientEmail = leaveItem?.email || leaveItem?.userEmail || u.email;
    const recipientName = u.name || recipientEmail?.split("@")[0] || "Employee";
    const commentText = comments[id] || "";

    try {
      // 1. Update Firestore record
      await updateDoc(doc(db, "leaves", id), {
        status,
        hrComment: commentText,
        reviewedAt: new Date().toISOString(),
      });

      setLeaves((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status, hrComment: commentText } : l
        )
      );

      // 2. Dispatch EmailJS notification (wrapped in try/catch to avoid breaking approval on email failure)
      try {
        await sendLeaveStatusEmail({
          toEmail: recipientEmail,
          employeeName: recipientName,
          status,
          comment: commentText,
        });
        toast.success(`Marked as ${status} — email notification sent!`);
      } catch (emailErr) {
        console.warn("Email notification dispatch error:", emailErr);
        toast.success(`Leave application ${status.toLowerCase()}!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filtered = leaves.filter((item) => {
    const u = userMap[item.uid] || {};
    const matchesSearch =
      (item.userEmail || item.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.uid || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.empId || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countPending = leaves.filter((l) => l.status === "Pending").length;
  const countApproved = leaves.filter((l) => l.status === "Approved").length;
  const countRejected = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Leave Approvals & Governance
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review employee time-off requests, leave balances, and auto-dispatch email notifications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              Email Alerts Connected
            </span>
          </div>
        </div>

        {/* Aggregated Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Total Applications</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {leaves.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="bi bi-inbox-fill"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Pending Review</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {countPending} Requests
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
                {countApproved}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <i className="bi bi-check2-circle"></i>
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Rejected</p>
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {countRejected}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
              <i className="bi bi-x-circle-fill"></i>
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
                placeholder="Search by applicant name, email, or employee ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    statusFilter === status
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

        {/* Leave Requests Directory */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-8">
              <EmptyState text="No leave applications match the selected criteria." />
            </Card>
          ) : (
            filtered.map((item) => {
              const u = userMap[item.uid] || {
                name: "Employee",
                email: item.email || item.userEmail || item.uid,
                empId: item.uid,
                department: "General",
              };

              const isPending = item.status === "Pending";
              const isUpdating = actionLoading[item.id];
              const startDate = item.start || item.startDate || "—";
              const endDate = item.end || item.endDate || "—";
              const leaveType = item.type || item.leaveType || "General";
              const remarksText = item.remarks || item.reason || "No remarks provided.";

              return (
                <Card
                  key={item.id}
                  className="p-6 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Applicant & Details Block */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                              {u.name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                              {u.empId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {item.email || item.userEmail || u.email} • {u.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800/60">
                          {leaveType} Leave
                        </span>
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <i className="bi bi-calendar3 text-indigo-500"></i>
                          {startDate} <span className="text-slate-400">to</span> {endDate}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Applicant Note
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                          "{remarksText}"
                        </p>
                      </div>

                      {item.hrComment && !isPending && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <i className="bi bi-chat-left-quote text-indigo-500"></i>
                          <span>HR Comment: <strong>{item.hrComment}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Status & Review Actions */}
                    <div className="flex flex-col sm:items-end justify-between gap-4 min-w-[280px]">
                      <Badge status={item.status || "Pending"} />

                      {isPending ? (
                        <div className="w-full space-y-3 pt-2">
                          <input
                            type="text"
                            placeholder="Add approval / rejection remarks..."
                            value={comments[item.id] || ""}
                            onChange={(e) =>
                              setComments({ ...comments, [item.id]: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />

                          <div className="flex items-center gap-2">
                            <Button
                              variant="success"
                              disabled={isUpdating}
                              onClick={() => updateStatus(item.id, "Approved")}
                              className="flex-1 py-2 text-xs"
                            >
                              <i className="bi bi-check-lg"></i>
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              disabled={isUpdating}
                              onClick={() => updateStatus(item.id, "Rejected")}
                              className="flex-1 py-2 text-xs"
                            >
                              <i className="bi bi-x-lg"></i>
                              Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <i className="bi bi-check2-all text-indigo-500"></i>
                          <span>Decision finalized</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}