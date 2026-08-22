<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import './Profile.css'; // Imports the matching dark theme styles

export default function Profile() {
  // Example data - replace with real user data from Firebase later
  const [employeeData, setEmployeeData] = useState({
    fullName: 'Alex Morgan',
    email: 'alex.morgan@dayflow.com',
    role: 'Software Engineer',
    department: 'Engineering',
    phone: '+1 (555) 019-2834',
    location: 'Bangalore, India',
    employeeId: 'DF-10293'
  });

  // Controls whether to show view mode or edit form
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would typically call an API or Firebase to save data
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container">
      {/* Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar">
          {employeeData.fullName.charAt(0)}
        </div>
        <div className="profile-title-info">
          <h2>{employeeData.fullName}</h2>
          <p>{employeeData.role} • {employeeData.department}</p>
        </div>
        <button 
          className="edit-toggle-btn" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Content Card (Details or Form) */}
      <div className="profile-content-card">
        <h3>Employee Information</h3>
        
        {!isEditing ? (
          // VIEW MODE: Clean data grid
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="label">Full Name</span>
              <span className="value">{employeeData.fullName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Employee ID</span>
              <span className="value">{employeeData.employeeId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email Address</span>
              <span className="value">{employeeData.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Department</span>
              <span className="value">{employeeData.department}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone Number</span>
              <span className="value">{employeeData.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Location</span>
              <span className="value">{employeeData.location}</span>
            </div>
          </div>
        ) : (
          // EDIT MODE: Input form
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={employeeData.fullName} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                type="text" 
                name="employeeId" 
                value={employeeData.employeeId} 
                onChange={handleChange} 
                readOnly /* Often non-editable */
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={employeeData.email} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input 
                type="text" 
                name="department" 
                value={employeeData.department} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                value={employeeData.phone} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                value={employeeData.location} 
                onChange={handleChange} 
              />
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        )}
>>>>>>> ef3f85338034776d29fe94672e31f6db312d3fea
      </div>

<<<<<<< HEAD
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
=======
>>>>>>> ef3f85338034776d29fe94672e31f6db312d3fea
