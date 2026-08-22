import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Card, PageContainer, Button, Badge, Spinner, EmptyState } from "../../components/ui";
import toast from "react-hot-toast";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("Checked Out");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchAttendance = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(collection(db, "attendance"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
      if (data.length > 0) {
        const latest = data[data.length - 1];
        setStatus(latest.type === "Check-In" ? "Checked In" : "Checked Out");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAction = async (type) => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "attendance"), {
        uid: user.uid,
        type: type,
        timestamp: serverTimestamp(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setStatus(type === "Check-In" ? "Checked In" : "Checked Out");
      toast.success(`Successfully recorded: ${type}`);
      await fetchAttendance();
    } catch (err) {
      toast.error("Failed to log attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Logging</h1>
          <p className="text-sm text-slate-500">Record check-in / check-out times and review punch history</p>
        </div>
        <Badge status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="flex flex-col justify-center items-center py-6">
          <span className="text-xs font-semibold text-slate-400 uppercase">Current Status</span>
          <span className="text-xl font-bold mt-1">{status}</span>
        </Card>
        <Card className="flex flex-col justify-center items-center py-6">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Punches</span>
          <span className="text-xl font-bold mt-1">{records.length}</span>
        </Card>
        <Card className="flex flex-col justify-center items-center py-6">
          <span className="text-xs font-semibold text-slate-400 uppercase">Shift</span>
          <span className="text-xl font-bold mt-1">General (9 AM - 5 PM)</span>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="font-semibold text-base mb-3">Quick Actions</h3>
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={() => handleAction("Check-In")}
            disabled={loading || status === "Checked In"}
          >
            Punch Check-In
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAction("Check-Out")}
            disabled={loading || status === "Checked Out"}
          >
            Punch Check-Out
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-base mb-4">Punch Records</h3>
        {fetching ? (
          <Spinner />
        ) : records.length === 0 ? (
          <EmptyState text="No attendance entries recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b dark:border-slate-700 text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2">Event</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {records.slice().reverse().map((r) => (
                  <tr key={r.id}>
                    <td className="py-3"><Badge status={r.type} /></td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{r.date}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{r.time}</td>
                    <td className="py-3"><span className="text-xs text-emerald-600 font-medium">✓ Verified</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}