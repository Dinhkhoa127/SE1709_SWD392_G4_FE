import React, { useState } from 'react';
import '../styles/AdminPage.css'; 
import Header from '../components/Header.jsx';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Sample data
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Font Awesome CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        {/* Navbar Component */}
        <Navbar 
          activeSection={activeSection} // Pass the active section
          isCollapsed={isCollapsed} 
          onSectionChange={handleSectionChange} // Pass the section change handler
        />
        
        {/* Header Component */}
        <Header
          activeSection={activeSection}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Content */}
        <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="content-area">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div>
                <div className="page-header">
                  <h1 className="page-title">Plant & Biology Sample Recognition System</h1>
                  <p className="page-description">Quản lý hệ thống nhận diện mẫu thực vật và sinh học cho giáo dục trung học phổ thông</p>
                </div>

                {/* Statistic Cards */}
                <div className="stat-grid">
                  <div className="stat-card">
                    <div className="stat-icon subjects-icon"><i className="fas fa-book"></i></div>
                    <div>
                      <div className="stat-value">3</div>
                      <div className="stat-label">Môn học</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon chapters-icon"><i className="fas fa-bookmark"></i></div>
                    <div>
                      <div className="stat-value">2</div>
                      <div className="stat-label">Chương</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon artifacts-icon"><i className="fas fa-microscope"></i></div>
                    <div>
                      <div className="stat-value">2</div>
                      <div className="stat-label">Mẫu vật</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon articles-icon"><i className="fas fa-newspaper"></i></div>
                    <div>
                      <div className="stat-value">0</div>
                      <div className="stat-label">Bài báo</div>
                    </div>
                  </div>
                </div>
                {/* End Statistic Cards */}

                <div className="content-grid">
                  <div className="content-card">
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon subjects-icon">
                          <i className="fas fa-book"></i>
                        </div>
                        Quản lí môn học 
                      </div>
                    </div>
                    <p>Quản lý các môn học và chủ đề sinh học. Tạo, chỉnh sửa và tổ chức các môn học theo chương trình giáo dục.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/subjects')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div className="content-card">
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon chapters-icon">
                          <i className="fas fa-bookmark"></i>
                        </div>
                        Quản lí chương 
                      </div>
                    </div>
                    <p>Tổ chức các chương học theo từng môn học. Quản lý nội dung và thứ tự các chương trong chương trình học.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/chapters')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div className="content-card">
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon artifacts-icon">
                          <i className="fas fa-microscope"></i>
                        </div>
                        Quản lí mẫu vật 
                      </div>
                    </div>
                    <p>Quản lý các mẫu vật thực vật và sinh học. Upload hình ảnh, mô tả và phân loại các mẫu vật cho hệ thống nhận diện.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/artifacts')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div className="content-card">
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon articles-icon">
                          <i className="fas fa-newspaper"></i>
                        </div>
                        Quản lí bài báo 
                      </div>
                    </div>
                    <p>Tạo và quản lý các bài viết giáo dục. Viết nội dung chi tiết về các mẫu vật và kiến thức sinh học.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/articles')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage;