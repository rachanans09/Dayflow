import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Card, PageContainer, Button, Badge, Input, Spinner, EmptyState } from "../../components/ui";
import toast from "react-hot-toast";

export default function ApproveLeave() {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const snap = await getDocs(collection(db, "leaves"));
      setLeaves(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "leaves", id), { status });
      toast.success(`Leave request marked as ${status}`);
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const filtered = leaves.filter((item) => {
    const matchesSearch = (item.userEmail || item.uid || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leave Approvals</h1>
          <p className="text-sm text-slate-500">Review, filter, and approve submitted employee leaves</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState text="No leave applications match your criteria." />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{item.userEmail || item.uid}</span>
                  <Badge status={item.status} />
                </div>
                <p className="text-xs text-slate-500">
                  {item.leaveType} Leave • <strong>{item.startDate}</strong> to <strong>{item.endDate}</strong>
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                  "{item.reason}"
                </p>
              </div>

              {item.status === "Pending" && (
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="success" onClick={() => updateStatus(item.id, "Approved")}>
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => updateStatus(item.id, "Rejected")}>
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}