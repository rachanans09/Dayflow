import React, { useState } from 'react';
import './App.css';

// Import components from your team's directories
import Attendance from './pages/Attendance/Attendance';
import Leave from './pages/Leave/Leave';
import Profile from './pages/Profile/Profile'; // Your profile component

function App() {
  // State to track which tab is currently active ('attendance', 'leave', or 'profile')
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-content">
          <h1>Dayflow HRMS</h1>
          <p className="subtitle">Employee Portal & Work Management</p>
        </div>

        {/* Navigation Tabs Bar */}
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

          {/* Your Integrated Profile Tab Button */}
          <button 
            onClick={() => setActiveTab('profile')} 
            className={activeTab === 'profile' ? 'active-tab' : ''}
          >
            Profile
          </button>
        </nav>
      </header>

      {/* Main Content View Switcher */}
      <main className="main-content">
        {activeTab === 'attendance' && <Attendance />}
        {activeTab === 'leave' && <Leave />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}

export default App;