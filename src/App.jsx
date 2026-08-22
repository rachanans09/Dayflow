import React, { useState } from 'react';
import './App.css';

// Import your profile component (verified from your sidebar)
import Profile from './pages/Profile/Profile';

// Import Attendance and Leave (adjusting paths to match standard layouts)
import Attendance from './pages/Attendance/Attendance';
import Leave from './pages/Leave/Leave'; // If this throws an error, check if your leave file is named differently

function App() {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-content">
          <h1>Dayflow HRMS</h1>
          <p className="subtitle">Employee Portal & Work Management</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button 
            onClick={() => setActiveTab('attendance')} 
            className={activeTab === 'attendance' ? 'active-tab' : ''}
          >
            Attendance
          </button>

          <button 
            onClick={() => setActiveTab('leave')} 
            className={activeTab === 'leave' ? 'active-tab' : ''}
          >
            Leave Management
          </button>

          <button 
            onClick={() => setActiveTab('profile')} 
            className={activeTab === 'profile' ? 'active-tab' : ''}
          >
            Profile
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'attendance' && <Attendance />}
        {activeTab === 'leave' && <Leave />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}

export default App;
