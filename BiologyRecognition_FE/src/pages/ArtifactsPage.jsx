import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/AdminPage.css';

const ArtifactsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [artifacts] = useState([
    { id: 1, name: 'Lá cây đa', type: 'Plant Sample', chapter: 'Quang hợp', image: '/api/placeholder/100/100', date: '2024-02-01', status: 'active' },
    { id: 2, name: 'Tế bào gan', type: 'Cell Sample', chapter: 'Cấu trúc tế bào', image: '/api/placeholder/100/100', date: '2024-02-03', status: 'active' }
  ]);

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifacts" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <Header activeSection="artifacts" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Artifacts Management</h1>
              <p className="page-description">Quản lý các mẫu vật sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> Thêm mới mẫu vật
              </button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                 
                    <th>Tên mẫu vật</th>
                    <th>Loại</th>
                    <th>Chương</th>
                    <th>Hình ảnh</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {artifacts.map(artifact => (
                    <tr key={artifact.id}>
                      
                      <td>{artifact.name}</td>
                      <td>{artifact.type}</td>
                      <td>{artifact.chapter}</td>
                      <td><img src={artifact.image} alt={artifact.name} width={40} /></td>
                      <td>{artifact.date}</td>
                      <td>
                        <span className={`status-badge ${artifact.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {artifact.status === 'active' ? 'Active' : 'Inactive'}
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

export default ArtifactsPage; 