import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/AdminPage.css';

const SettingsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="settings" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <Header activeSection="settings" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">System Settings</h1>
              <p className="page-description">Trang cài đặt hệ thống. Bạn có thể thêm các tuỳ chọn cấu hình tại đây.</p>
            </div>
            {/* Thêm các tuỳ chọn cấu hình ở đây */}
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingsPage; 