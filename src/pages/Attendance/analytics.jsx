import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, PageContainer, Spinner } from "../../components/ui";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "attendance"));
        const counts = { "Check-In": 0, "Check-Out": 0 };
        snap.docs.forEach((d) => {
          const type = d.data().type;
          if (counts[type] !== undefined) counts[type]++;
        });
        setData([
          { name: "Check-Ins", count: counts["Check-In"] },
          { name: "Check-Outs", count: counts["Check-Out"] },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">HR Analytics & Reports</h1>
        <p className="text-sm text-slate-500">Live operational overview across all employee actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-base font-semibold mb-4 text-slate-700 dark:text-slate-200">Attendance Volume</h2>
          {loading ? (
            <Spinner />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-base font-semibold mb-4 text-slate-700 dark:text-slate-200">System Metrics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-xs font-semibold text-slate-500 uppercase">Live Activity Status</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">Operational (100%)</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-xs font-semibold text-slate-500 uppercase">Database Link</span>
              <p className="text-xl font-bold text-indigo-600 mt-1">Firebase Firestore Live</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}