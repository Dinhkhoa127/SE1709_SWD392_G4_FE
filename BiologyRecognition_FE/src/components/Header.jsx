import React, { useState } from 'react';
import '../styles/Header.css'; // Import the CSS file

const Header = ({ activeSection, isCollapsed, onToggleCollapse }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const getSectionName = (section) => {
    const sectionNames = {
      'dashboard': 'Dashboard',
      'subjects': 'Subjects Management',
      'chapters': 'Chapters Management',
      'artifacts': 'Artifacts Management',
      'articles': 'Articles Management',
      'settings': 'System Settings'
    };
    return sectionNames[section] || 'Dashboard';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`top-bar ${isCollapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="toggle-btn" onClick={onToggleCollapse}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-main">{getSectionName(activeSection)}</span>
          <span> / Hệ thống nhận dạng thực vật và sinh học</span>
        </div>
      </div>
      
      <div className="user-info" style={{ position: 'relative' }}>
        <div className="notification-icon">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </div>
        <span className="user-name">Admin User</span>
        <div className="user-avatar" title="Admin User" onClick={toggleDropdown}>
          AU
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item">
              <i className="fas fa-user"></i> My Profile
            </button>
            <button className="dropdown-item">
              <i className="fas fa-cog"></i> Settings
            </button>
            <button className="dropdown-item">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;