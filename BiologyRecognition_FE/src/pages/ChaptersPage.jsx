import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';


const ChaptersPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chapters] = useState([
    { chapter_id: 1, name: 'Cấu trúc tế bào', subject: 'Sinh học tế bào', description: 'Các thành phần cơ bản của tế bào', CreatedDate: '2024-01-16', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-17', status: 'active' },
    { chapter_id: 2, name: 'Quang hợp', subject: 'Thực vật học', description: 'Quá trình quang hợp ở thực vật', CreatedDate: '2024-01-21', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-22', status: 'active' }
  ]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar 
          activeSection="chapters" 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
        />
        <Header 
          activeSection="chapters" 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
        />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Chapters Management</h1>
              <p className="page-description">Quản lý các chương học sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> Thêm mới chương
              </button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên chương</th>
                    <th>Môn học</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Người sửa cuối</th>
                    <th>Ngày sửa cuối</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map(chapter => (
                    <tr key={chapter.chapter_id}>
                      <td>{chapter.name}</td>
                      <td>{chapter.subject}</td>
                      <td>{chapter.description}</td>
                      <td>{chapter.CreatedDate}</td>
                      <td>{chapter.CreatedBy}</td>
                      <td>{chapter.ModifiedBy}</td>
                      <td>{chapter.ModifiedDate}</td>
                      <td>
                        <span className={`status-badge ${chapter.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {chapter.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-edit" title="Sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-delete" title="Xóa">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChaptersPage;