import React, { useRef, useState } from 'react';
import '../styles/AdminPage.css'; 
import Header from '../components/Header.jsx';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [highlightedCard, setHighlightedCard] = useState(null);
  const navigate = useNavigate();

  // Tạo ref cho từng card
  const subjectsRef = useRef(null);
  const chaptersRef = useRef(null);
  const topicsRef = useRef(null);
  const artifactsRef = useRef(null);
  const articlesRef = useRef(null);
  const artifactTypesRef = useRef(null);
  const artifactImagesRef = useRef(null);
  const usersRef = useRef(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Hàm scroll đến card và highlight
  const handleStatClick = (ref, cardName) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedCard(cardName);
      setTimeout(() => setHighlightedCard(null), 1500); // highlight 1.5s
    }
  };

  return (
    <>
      {/* Decorative Leaves */}
      <div className="admin-decorative-leaves">
        <div className="admin-deco-leaf admin-leaf-1">🌿</div>
        <div className="admin-deco-leaf admin-leaf-2">🍃</div>
        <div className="admin-deco-leaf admin-leaf-3">🌿</div>
        <div className="admin-deco-leaf admin-leaf-4">🍃</div>
      </div>

      <div className="admin-container">
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
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
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
                  <div className="stat-card" onClick={() => handleStatClick(subjectsRef, 'subjects')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon subjects-icon"><i className="fas fa-book"></i></div>
                    <div>
                      <div className="stat-value">3</div>
                      <div className="stat-label">Môn học</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(chaptersRef, 'chapters')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon chapters-icon"><i className="fas fa-bookmark"></i></div>
                    <div>
                      <div className="stat-value">2</div>
                      <div className="stat-label">Chương</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(topicsRef, 'topics')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon topics-icon"><i className="fas fa-tags"></i></div>
                    <div>
                      <div className="stat-value">5</div>
                      <div className="stat-label">Chủ đề</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(artifactsRef, 'artifacts')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon artifacts-icon"><i className="fas fa-microscope"></i></div>
                    <div>
                      <div className="stat-value">2</div>
                      <div className="stat-label">Mẫu sinh vật</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(articlesRef, 'articles')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon articles-icon"><i className="fas fa-newspaper"></i></div>
                    <div>
                      <div className="stat-value">0</div>
                      <div className="stat-label">Bài báo</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(artifactTypesRef, 'artifactTypes')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon artifact-types-icon"><i className="fas fa-leaf"></i></div>
                    <div>
                      <div className="stat-value">4</div>
                      <div className="stat-label">Loại mẫu sinh vật</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(artifactImagesRef, 'artifactImages')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon artifact-images-icon"><i className="fas fa-image"></i></div>
                    <div>
                      <div className="stat-value">12</div>
                      <div className="stat-label">Hình ảnh mẫu sinh vật</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => handleStatClick(usersRef, 'users')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon users-icon"><i className="fas fa-users"></i></div>
                    <div>
                      <div className="stat-value">8</div>
                      <div className="stat-label">Lịch sử nhận diện</div>
                    </div>
                  </div>
                  <div className="stat-card" onClick={() => navigate('/users')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon pending-users-icon"><i className="fas fa-user-clock"></i></div>
                    <div>
                      <div className="stat-value">3</div>
                      <div className="stat-label">Người dùng chờ cấp quyền</div>
                    </div>
                  </div>
                </div>
                {/* End Statistic Cards */}

                <div className="content-grid">
                  <div
                    className={`content-card${highlightedCard === 'subjects' ? ' highlight' : ''}`}
                    ref={subjectsRef}
                  >
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

                  <div
                    className={`content-card${highlightedCard === 'chapters' ? ' highlight' : ''}`}
                    ref={chaptersRef}
                  >
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

                  <div
                    className={`content-card${highlightedCard === 'topics' ? ' highlight' : ''}`}
                    ref={topicsRef}
                  >
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon topics-icon">
                          <i className="fas fa-tags"></i>
                        </div>
                        Quản lí chủ đề 
                      </div>
                    </div>
                    <p>Quản lý các chủ đề sinh học. Tạo, chỉnh sửa và phân loại các chủ đề cho từng chương và môn học.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/topics')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div
                    className={`content-card${highlightedCard === 'artifacts' ? ' highlight' : ''}`}
                    ref={artifactsRef}
                  >
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon artifacts-icon">
                          <i className="fas fa-microscope"></i>
                        </div>
                        Quản lí mẫu sinh vật 
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

                  <div
                    className={`content-card${highlightedCard === 'articles' ? ' highlight' : ''}`}
                    ref={articlesRef}
                  >
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

                  <div
                    className={`content-card${highlightedCard === 'artifactTypes' ? ' highlight' : ''}`}
                    ref={artifactTypesRef}
                  >
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon artifact-types-icon">
                          <i className="fas fa-leaf"></i>
                        </div>
                        Quản lí loại mẫu sinh vật  
                      </div>
                    </div>
                    <p>Quản lý các loại mẫu sinh vật, phân loại và tổ chức các nhóm mẫu vật cho hệ thống sinh học.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/artifact-types')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div
                    className={`content-card${highlightedCard === 'artifactImages' ? ' highlight' : ''}`}
                    ref={artifactImagesRef}
                  >
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon artifact-images-icon">
                          <i className="fas fa-image"></i>
                        </div>
                        Quản lí hình ảnh mẫu sinh vật
                      </div>
                    </div>
                    <p>Quản lý hình ảnh của các mẫu sinh vật, upload, xem chi tiết, chỉnh sửa và phân loại hình ảnh.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/artifact-medias')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div
                    className={`content-card${highlightedCard === 'users' ? ' highlight' : ''}`}
                    ref={usersRef}
                  >
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon users-icon">
                          <i className="fas fa-users"></i>
                        </div>
                        Quản lí lịch sử nhận diện
                      </div>
                    </div>
                    <p>Quản lý lịch sử những lần nhận diện trong app nhận diện các mẫu vật sinh học của học sinh.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/recognitions')}>
                        <i className="fas fa-arrow-right"></i>
                        Quản lí
                      </button>
                    </div>
                  </div>

                  <div className="content-card">
                    <div className="card-header">
                      <div className="card-title">
                        <div className="card-icon pending-users-icon">
                          <i className="fas fa-user-shield"></i>
                        </div>
                        Quản lí người dùng & cấp quyền
                      </div>
                    </div>
                    <p>Quản lý tài khoản người dùng, phân quyền truy cập và phê duyệt các tài khoản đang chờ cấp quyền.</p>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => navigate('/users')}>
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