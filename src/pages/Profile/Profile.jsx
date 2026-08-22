import React, { useState } from 'react';
import './Profile.css'; // Make sure this CSS file exists, or it uses App.css styles

export default function Profile() {
  const [employeeData, setEmployeeData] = useState({
    fullName: 'Alex Morgan',
    email: 'alex.morgan@dayflow.com',
    role: 'Software Engineer',
    department: 'Engineering',
    phone: '+1 (555) 019-2834',
    location: 'Bangalore, India'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container">
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
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content-card">
        <h3>Employee Information</h3>
        
        {!isEditing ? (
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="label">Full Name</span>
              <span className="value">{employeeData.fullName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email Address</span>
              <span className="value">{employeeData.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Role</span>
              <span className="value">{employeeData.role}</span>
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
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={employeeData.fullName} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={employeeData.email} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input 
                type="text" 
                name="role" 
                value={employeeData.role} 
                onChange={handleChange} 
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
      </div>
    </div>
  );
}
 