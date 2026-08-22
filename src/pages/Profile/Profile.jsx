import React, { useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [employeeData, setEmployeeData] = useState({
    fullName: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    location: ''
  });

  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile details saved successfully!');
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-main-card">
        {/* Top Header */}
        <div className="profile-top-header">
          <h1>Dayflow HRMS</h1>
          <p>Employee Portal & Work Management</p>
        </div>

        {/* Profile Content Block */}
        <div className="profile-info-box">
          <div className="profile-info-header">
            <h3>User Profile Form</h3>
            <span className="status-badge">{isEditing ? '● Editing' : '● Saved'}</span>
          </div>

          {!isEditing ? (
            <div>
              <div className="profile-details-grid" style={{ marginBottom: '20px' }}>
                <div className="profile-field-card">
                  <div className="field-label">Full Name</div>
                  <div className="field-value">{employeeData.fullName || 'Not provided'}</div>
                </div>
                <div className="profile-field-card">
                  <div className="field-label">Role</div>
                  <div className="field-value">{employeeData.role || 'Not provided'}</div>
                </div>
                <div className="profile-field-card">
                  <div className="field-label">Department</div>
                  <div className="field-value">{employeeData.department || 'Not provided'}</div>
                </div>
                <div className="profile-field-card">
                  <div className="field-label">Phone Number</div>
                  <div className="field-value">{employeeData.phone || 'Not provided'}</div>
                </div>
                <div className="profile-field-card full-width" style={{ gridColumn: 'span 2' }}>
                  <div className="field-label">Email Address</div>
                  <div className="field-value">{employeeData.email || 'Not provided'}</div>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-primary-action" 
                onClick={() => setIsEditing(true)}
                style={{ width: '100%' }}
              >
                Edit Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="profile-details-grid">
              <div className="profile-field-card">
                <div className="field-label">Full Name</div>
                <input 
                  type="text" 
                  name="fullName" 
                  value={employeeData.fullName} 
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  style={{ width: '100%', background: '#121824', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  required
                />
              </div>
              <div className="profile-field-card">
                <div className="field-label">Role</div>
                <input 
                  type="text" 
                  name="role" 
                  value={employeeData.role} 
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  style={{ width: '100%', background: '#121824', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>
              <div className="profile-field-card">
                <div className="field-label">Department</div>
                <input 
                  type="text" 
                  name="department" 
                  value={employeeData.department} 
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  style={{ width: '100%', background: '#121824', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>
              <div className="profile-field-card">
                <div className="field-label">Phone Number</div>
                <input 
                  type="text" 
                  name="phone" 
                  value={employeeData.phone} 
                  onChange={handleChange}
                  placeholder="Enter phone number..."
                  style={{ width: '100%', background: '#121824', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>
              <div className="profile-field-card full-width" style={{ gridColumn: 'span 2' }}>
                <div className="field-label">Email Address</div>
                <input 
                  type="email" 
                  name="email" 
                  value={employeeData.email} 
                  onChange={handleChange}
                  placeholder="Enter email address..."
                  style={{ width: '100%', background: '#121824', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  required
                />
              </div>
              <div className="profile-field-card full-width" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                <button type="submit" className="btn-primary-action" style={{ width: '100%', padding: '12px' }}>
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Actions Box */}
        <div className="profile-actions-box">
          <h3>Quick Actions</h3>
          <div className="action-buttons-group">
            <button 
              type="button" 
              className="btn-primary-action" 
              onClick={() => setEmployeeData({ fullName: '', email: '', role: '', department: '', phone: '', location: '' })}
            >
              Clear Form
            </button>
            <button type="button" className="btn-secondary-action" onClick={() => alert('Viewing system logs...')}>
              View Activity Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

