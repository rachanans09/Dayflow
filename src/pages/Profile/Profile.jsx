import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, Button, Spinner } from "../../components/ui";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

export default function Profile() {
  const { uid: paramUid } = useParams();
  const currentUid = auth.currentUser?.uid;
  const targetUid = paramUid || currentUid;
  const isAdminView = Boolean(paramUid && paramUid !== currentUid);

  const [role, setRole] = useState("Employee");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Engineering",
    jobTitle: "Software Engineer",
    address: "",
    documents: "",
  });

  const [payroll, setPayroll] = useState({
    basic: 0,
    allowances: 0,
    deductions: 0,
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user || !targetUid) return;

      try {
        // 1. Fetch current logged-in user's role
        const currentUserDoc = await getDoc(doc(db, "users", user.uid));
        const userRole = currentUserDoc.exists() ? currentUserDoc.data().role : "Employee";
        setRole(userRole);

        // 2. Fetch target user's account info
        const targetUserDoc = await getDoc(doc(db, "users", targetUid));
        const targetUserEmail = targetUserDoc.exists()
          ? targetUserDoc.data().email
          : user.email;

        // 3. Fetch profile record
        const profileDoc = await getDoc(doc(db, "profiles", targetUid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setProfile({
            name: data.name || (targetUid === user.uid ? user.displayName || targetUserEmail?.split("@")[0] : "Employee"),
            email: data.email || targetUserEmail,
            phone: data.phone || "",
            department: data.department || "Engineering",
            jobTitle: data.jobTitle || data.designation || "Software Engineer",
            address: data.address || "",
            documents: data.documents || "",
          });
        } else {
          setProfile((prev) => ({
            ...prev,
            name: targetUid === user.uid ? user.displayName || targetUserEmail?.split("@")[0] : "Employee",
            email: targetUserEmail,
          }));
        }

        // 4. Fetch payroll record
        const payrollDoc = await getDoc(doc(db, "payroll", targetUid));
        if (payrollDoc.exists()) {
          const payData = payrollDoc.data();
          setPayroll({
            basic: Number(payData.basic) || 0,
            allowances: Number(payData.allowances) || 0,
            deductions: Number(payData.deductions) || 0,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [targetUid]);

  const canEditPayroll = role === "HR";
  const netSalary = (Number(payroll.basic) || 0) + (Number(payroll.allowances) || 0) - (Number(payroll.deductions) || 0);

  const downloadPayslip = () => {
    if (!window.jspdf) {
      toast.error("PDF generator is initializing, please try again in a moment.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const docPdf = new jsPDF();

    docPdf.setFontSize(20);
    docPdf.setTextColor(79, 70, 229);
    docPdf.text("DAYFLOW HRMS - PAYSLIP", 20, 22);

    docPdf.setFontSize(10);
    docPdf.setTextColor(100);
    docPdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    docPdf.line(20, 34, 190, 34);

    docPdf.setFontSize(12);
    docPdf.setTextColor(20);
    docPdf.text(`Employee Name: ${profile.name || "Employee"}`, 20, 45);
    docPdf.text(`Email: ${profile.email}`, 20, 53);
    docPdf.text(`Department: ${profile.department}`, 20, 61);
    docPdf.text(`Designation: ${profile.jobTitle}`, 20, 69);

    docPdf.line(20, 75, 190, 75);
    docPdf.setFontSize(13);
    docPdf.setTextColor(79, 70, 229);
    docPdf.text("Earnings & Deductions Breakdown", 20, 85);

    docPdf.setFontSize(11);
    docPdf.setTextColor(40);
    docPdf.text("Basic Salary:", 20, 97);
    docPdf.text(`INR ${payroll.basic.toLocaleString()}`, 150, 97, { align: "right" });

    docPdf.text("Allowances & Bonuses:", 20, 107);
    docPdf.text(`+ INR ${payroll.allowances.toLocaleString()}`, 150, 107, { align: "right" });

    docPdf.text("Statutory Deductions (PF / Tax):", 20, 117);
    docPdf.text(`- INR ${payroll.deductions.toLocaleString()}`, 150, 117, { align: "right" });

    docPdf.line(20, 125, 190, 125);
    docPdf.setFontSize(14);
    docPdf.setTextColor(16, 185, 129);
    docPdf.text("Net Take-Home Salary:", 20, 137);
    docPdf.text(`INR ${netSalary.toLocaleString()}`, 150, 137, { align: "right" });

    docPdf.save(`Payslip_${(profile.name || "Employee").replace(/\s+/g, "_")}.pdf`);
    toast.success("Payslip PDF downloaded successfully!");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!targetUid) return;

    setSaving(true);
    try {
      // Save Profile Data
      await setDoc(
        doc(db, "profiles", targetUid),
        {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          department: profile.department,
          jobTitle: profile.jobTitle,
          email: profile.email,
          documents: profile.documents,
        },
        { merge: true }
      );

      // Save Payroll Data (if HR)
      if (canEditPayroll) {
        await setDoc(
          doc(db, "payroll", targetUid),
          {
            basic: Number(payroll.basic) || 0,
            allowances: Number(payroll.allowances) || 0,
            deductions: Number(payroll.deductions) || 0,
            netSalary,
          },
          { merge: true }
        );
      }

      toast.success("Profile saved successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full flex items-center justify-center min-h-[60vh]">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {isAdminView ? "Employee Records" : "My Profile"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAdminView
                ? "Review and administer profile, official documents, and payroll allocations for this employee."
                : "Manage your personal profile records, statutory documents, and review your monthly compensation summary."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={downloadPayslip}
              className="text-xs"
            >
              <i className="bi bi-file-earmark-pdf-fill text-rose-500"></i> Download Payslip
            </Button>
            {(role === "HR" || !isAdminView) && (
              <Button
                type="button"
                variant={editing ? "secondary" : "primary"}
                onClick={() => setEditing(!editing)}
              >
                <i className={`bi ${editing ? "bi-x-lg" : "bi-pencil-square"}`}></i>
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            )}
          </div>
        </div>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Avatar & Compensation Summary */}
          <div className="space-y-6">
            <Card className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/25">
                {profile.name ? profile.name.charAt(0).toUpperCase() : profile.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {profile.name || "Employee"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {profile.jobTitle || "Team Member"}
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold rounded-full">
                  {profile.department || "Engineering"}
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full">
                  {isAdminView ? "Managed User" : `Role: ${role}`}
                </span>
              </div>
            </Card>

            {/* Compensation Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <i className="bi bi-wallet2 text-indigo-600 dark:text-indigo-400"></i>
                  Compensation Summary
                </h3>
                {canEditPayroll && editing && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                    HR Editable
                  </span>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Basic Pay</span>
                  {editing && canEditPayroll ? (
                    <input
                      type="number"
                      value={payroll.basic}
                      onChange={(e) => setPayroll({ ...payroll, basic: Number(e.target.value) })}
                      className="w-28 px-2 py-1 text-right border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{payroll.basic.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Allowances</span>
                  {editing && canEditPayroll ? (
                    <input
                      type="number"
                      value={payroll.allowances}
                      onChange={(e) => setPayroll({ ...payroll, allowances: Number(e.target.value) })}
                      className="w-28 px-2 py-1 text-right border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +₹{payroll.allowances.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Deductions</span>
                  {editing && canEditPayroll ? (
                    <input
                      type="number"
                      value={payroll.deductions}
                      onChange={(e) => setPayroll({ ...payroll, deductions: Number(e.target.value) })}
                      className="w-28 px-2 py-1 text-right border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      -₹{payroll.deductions.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 font-bold">
                  <span className="text-slate-800 dark:text-slate-100">Net Calculated Salary</span>
                  <span className="text-base text-indigo-600 dark:text-indigo-400">
                    ₹{netSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              {!canEditPayroll && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center gap-1.5">
                  <i className="bi bi-shield-lock"></i>
                  Read-only: Payroll parameters are managed exclusively by HR.
                </p>
              )}
            </Card>

            {/* SRS 3.3.1 Documents Section */}
            <Card className="p-6">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <i className="bi bi-file-earmark-text text-indigo-600 dark:text-indigo-400"></i>
                Official Documents
              </h3>
              {editing ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Document Link (Offer Letter, ID Proof)
                  </label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/..."
                    value={profile.documents}
                    onChange={(e) => setProfile({ ...profile, documents: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : profile.documents ? (
                <a
                  href={profile.documents}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <i className="bi bi-link-45deg text-base"></i> View Stored Documents
                </a>
              ) : (
                <p className="text-xs text-slate-400">No verification documents on file.</p>
              )}
            </Card>
          </div>

          {/* Right Column: Detailed Editable Form */}
          <Card className="lg:col-span-2 p-6 md:p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Personal & Employment Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition ${
                        editing
                          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          : "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3.5 py-2.5 border rounded-xl text-sm bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Role & Department
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={profile.department}
                      disabled={!editing || (!canEditPayroll && isAdminView)}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition ${
                        editing
                          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          : "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={profile.jobTitle}
                      disabled={!editing || !canEditPayroll}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition ${
                        editing && canEditPayroll
                          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          : "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Contact & Location
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={profile.phone}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition ${
                        editing
                          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          : "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={profile.address}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition ${
                        editing
                          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          : "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving Record..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}