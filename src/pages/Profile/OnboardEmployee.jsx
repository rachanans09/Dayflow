import { useState } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Card, Button, Input, PageContainer } from "../../components/ui";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

export default function OnboardEmployee() {
  const [empId, setEmpId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empId.trim()) {
      toast.error("Please provide a valid Employee ID.");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "onboarding", empId.trim()), {
        jobTitle: jobTitle.trim(),
        department: department.trim(),
        salary: Number(salary) || 0,
        createdAt: new Date().toISOString(),
      });

      toast.success(`Employee ${empId} onboarded! They can now sign up.`);
      setEmpId("");
      setJobTitle("");
      setDepartment("");
      setSalary("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to onboard employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Employee Pre-Onboarding
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure initial job role, department, and compensation records for upcoming accounts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              HR Administration
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Info Card */}
          <Card className="flex flex-col p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              How Onboarding Works
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Assign an ID (e.g., <code className="text-indigo-600 dark:text-indigo-400 font-mono">EMP-105</code>) along with designated role parameters. When the employee registers on the Sign Up portal with this ID, their profile automatically populates with these credentials.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-emerald-500"></i> Auto-synced to Firestore
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-emerald-500"></i> Integrated with Payroll module
              </div>
            </div>
          </Card>

          {/* Form Card */}
          <Card className="lg:col-span-2 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Employee ID"
                  placeholder="e.g. EMP-105"
                  value={empId}
                  required
                  onChange={(e) => setEmpId(e.target.value)}
                />
                <Input
                  label="Job Title"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  required
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Department"
                  placeholder="e.g. Product Engineering"
                  value={department}
                  required
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <Input
                  label="Annual Starting Salary (₹)"
                  placeholder="e.g. 850000"
                  type="number"
                  value={salary}
                  required
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? "Registering Record..." : "Onboard Employee"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
}