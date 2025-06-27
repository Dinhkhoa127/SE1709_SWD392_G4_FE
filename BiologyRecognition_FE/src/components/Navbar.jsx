import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ activeSection, isCollapsed }) => {
  const navigate = useNavigate();

  // Navigation items with id, icon, and text
  const navItems = [
  { id: 'dashboard', icon: 'fa fa-bar-chart', text: 'Tổng hợp', path: '/admin' },
    { id: 'subjects', icon: 'fas fa-book', text: 'Môn học', path: '/subjects' },
      { id: 'topics', icon: 'fas fa-tags', text: 'Chủ đề', path: '/topics' },
    { id: 'chapters', icon: 'fas fa-bookmark', text: 'Chương', path: '/chapters' },
    { id: 'artifacts', icon: 'fas fa-microscope', text: 'Mẫu sinh vật', path: '/artifacts' },
    { id: 'artifact-types', icon: 'fa-solid fa-seedling', text: 'Loại mẫu sinh vật', path: '/artifact-types' },
    { id: 'artifact-images', icon: 'fas fa-image', text: 'Hình ảnh mẫu sinh vật', path: '/artifact-images' },
    { id: 'articles', icon: 'fas fa-newspaper', text: 'Bài báo', path: '/articles' },
    { id: 'settings', icon: 'fas fa-cog', text: 'Cài đặt', path: '/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <div className="logo">
            <i className="fas fa-leaf"></i>
          </div>
          <div className="sidebar-title">Biology Admin</div>
        </div>
      </div>

      <div className="nav-menu">
        {navItems.map(item => (
          <div key={item.id} className="nav-item">
            <button
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)} // Use the handleNavigation function
            >
              <i className={`${item.icon} nav-icon`}></i>
              <span className="nav-text">{item.text}</span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;