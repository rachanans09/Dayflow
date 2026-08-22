import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, PageContainer, Button, Input, Spinner } from "../../components/ui";
import toast from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    role: "Employee",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile((prev) => ({ ...prev, ...docSnap.data(), email: user.email }));
        } else {
          setProfile((prev) => ({ ...prev, email: user.email }));
        }
      } catch (err) {
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "profiles", user.uid), {
        phone: profile.phone || "",
        address: profile.address || "",
      });
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      toast.error("Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Employee Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and update your personal employee records</p>
        </div>
        <Button
          variant={editing ? "secondary" : "primary"}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <Card className="flex flex-col items-center text-center p-8">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            {profile.name ? profile.name.charAt(0).toUpperCase() : profile.email?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{profile.name || "Employee"}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{profile.designation || "Team Member"}</p>
          <span className="mt-3 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
            {profile.department || "Engineering"}
          </span>
        </Card>

        {/* Right Column: Detailed Fields */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name || ""}
                disabled
                className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-75"
              />
              <Input
                label="Work Email"
                value={profile.email || ""}
                disabled
                className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-75"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Department"
                value={profile.department || ""}
                disabled
                className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-75"
              />
              <Input
                label="Designation"
                value={profile.designation || ""}
                disabled
                className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-75"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Number"
                placeholder="+91 98765 43210"
                value={profile.phone || ""}
                disabled={!editing}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Input
                label="Residential Address"
                placeholder="City, State"
                value={profile.address || ""}
                disabled={!editing}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            {editing && (
              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}