import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";

const employeeLinks = [
  { to: "/dashboard", icon: "bi-grid-1x2", label: "Dashboard" },
  { to: "/profile", icon: "bi-person-circle", label: "Profile" },
  { to: "/attendance", icon: "bi-calendar-check", label: "Attendance" },
  { to: "/apply-leave", icon: "bi-airplane", label: "Apply Leave" },
];

const hrLinks = [
  { to: "/approve-leave", icon: "bi-clipboard-check", label: "Approve Leave" },
  { to: "/admin-attendance", icon: "bi-people", label: "Admin Attendance" },
  { to: "/onboard-employee", icon: "bi-person-plus", label: "Onboard Employee" },
  { to: "/all-employees", icon: "bi-people-fill", label: "All Employees" },
  { to: "/analytics", icon: "bi-bar-chart", label: "Analytics" },
];

export default function Sidebar({ role, userName, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hrExpanded, setHrExpanded] = useState(true);
  const location = useLocation();

  const isHrActive = hrLinks.some((l) => location.pathname === l.to);

  return (
    <aside className={`df-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="df-sidebar-header">
        <div className="df-logo">
          <div className="df-logo-icon"><i className="bi bi-stack"></i></div>
          <div className="df-logo-text">Dayflow</div>
        </div>
        <button
          className="df-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle Navigation"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
      </div>

      <nav className="df-nav-section">
        <div className="df-section-title">Main</div>
        {employeeLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `df-nav-item ${isActive ? "active" : ""}`}
          >
            <span className="df-nav-link">
              <span className="df-nav-icon"><i className={`bi ${link.icon}`}></i></span>
              <span className="df-nav-text">{link.label}</span>
            </span>
          </NavLink>
        ))}

        {role === "HR" && (
          <>
            <div className="df-section-title">HR Management</div>
            <div className={`df-nav-item ${hrExpanded ? "expanded" : ""} ${isHrActive ? "active" : ""}`}>
              <button
                type="button"
                className="df-nav-link"
                onClick={() => setHrExpanded(!hrExpanded)}
              >
                <span className="df-nav-icon"><i className="bi bi-briefcase"></i></span>
                <span className="df-nav-text">HR Tools</span>
                <i className="bi bi-chevron-right df-chevron"></i>
              </button>
              <div className="df-subnav">
                {hrLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `df-subnav-link ${isActive ? "active" : ""}`}
                  >
                    <i className={`bi ${link.icon} mr-2 text-xs opacity-70`}></i>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="df-sidebar-footer">
        <div className="df-avatar">{(userName || "U")[0].toUpperCase()}</div>
        <div className="df-user-info">
          <div className="df-user-name">{userName || "User"}</div>
          <div className="df-user-role">{role || "Employee"}</div>
        </div>
        <button className="df-logout-btn" onClick={onLogout} title="Logout">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </aside>
  );
}