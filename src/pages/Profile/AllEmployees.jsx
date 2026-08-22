import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, Spinner, EmptyState } from "../../components/ui";
import Layout from "../../components/Layout";

export default function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const profilesSnap = await getDocs(collection(db, "profiles"));

        const profileLookup = {};
        profilesSnap.docs.forEach((d) => {
          profileLookup[d.id] = d.data();
        });

        const list = usersSnap.docs.map((d) => {
          const u = d.data();
          const p = profileLookup[d.id] || {};
          return {
            uid: d.id,
            empId: u.empId || d.id,
            email: u.email || "No email",
            role: u.role || "Employee",
            name: p.name || u.email?.split("@")[0] || "Employee",
            department: p.department || "Engineering",
            jobTitle: p.jobTitle || p.designation || "Team Member",
          };
        });

        setEmployees(list);
      } catch (err) {
        console.error("Error loading employee directory:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.empId.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              All Employees Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Switch between employee profiles, adjust payroll allocations, and inspect punch logs.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            {employees.length} Total Users
          </span>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative">
            <i className="bi bi-search absolute left-3.5 top-3 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search by employee name, ID, email, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </Card>

        {/* Employee Cards Grid */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8">
            <EmptyState text="No employees match your search criteria." />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((emp) => (
              <Card
                key={emp.uid}
                className="p-5 flex flex-col justify-between hover:shadow-md transition border border-slate-200 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {emp.name}
                        </h3>
                        <p className="text-xs text-slate-400">{emp.jobTitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {emp.role}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 my-3 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p>
                      <span className="text-slate-400">ID:</span>{" "}
                      <code className="font-mono text-indigo-600 dark:text-indigo-400">{emp.empId}</code>
                    </p>
                    <p className="truncate">
                      <span className="text-slate-400">Email:</span> {emp.email}
                    </p>
                    <p>
                      <span className="text-slate-400">Dept:</span> {emp.department}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 text-xs font-semibold">
                  <Link
                    to={`/attendance/${emp.uid}`}
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
                  >
                    <i className="bi bi-calendar-check"></i> Attendance
                  </Link>
                  <Link
                    to={`/employee/${emp.uid}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition"
                  >
                    <i className="bi bi-person-fill"></i> View Profile
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}