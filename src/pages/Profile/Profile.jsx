import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, PageContainer, Button, Input, Spinner } from "../../components/ui";
import toast from "react-hot-toast";

export default function Profile() {
  const [data, setData] = useState({ name: "", phone: "", address: "", jobTitle: "", department: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "profiles", user.uid));
        if (snap.exists()) setData(snap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await setDoc(doc(db, "profiles", user.uid), data, { merge: true });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to save profile.");
    }
  };

  if (loading) return <PageContainer><Spinner /></PageContainer>;

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-slate-500">Manage your contact information and view job assignments</p>
        </div>
        <Button variant={editing ? "secondary" : "primary"} onClick={() => (editing ? save() : setEditing(true))}>
          {editing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 text-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
            {(data.name || auth.currentUser?.email || "U")[0].toUpperCase()}
          </div>
          <h3 className="font-bold text-lg">{data.name || "Employee Name"}</h3>
          <p className="text-xs text-slate-500">{data.jobTitle || "Job Title"}</p>
          <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
            {data.department || "General"}
          </span>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-base font-semibold mb-4 border-b pb-2 dark:border-slate-700">Account & Job Details</h3>
          <div className="space-y-3">
            <Input label="Email" value={auth.currentUser?.email || ""} disabled />
            <Input
              label="Full Name"
              value={data.name || ""}
              disabled={!editing}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <Input
              label="Phone"
              value={data.phone || ""}
              disabled={!editing}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
            <Input
              label="Address"
              value={data.address || ""}
              disabled={!editing}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Job Title (HR Managed)" value={data.jobTitle || "Not Assigned"} disabled />
              <Input label="Department (HR Managed)" value={data.department || "Not Assigned"} disabled />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}