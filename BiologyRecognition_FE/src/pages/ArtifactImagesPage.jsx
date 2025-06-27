import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

const ArtifactImagesPage = () => {
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [images] = useState([
    { image_id: 1, artifact: 'Lá cây đa', name: 'Ảnh lá cây đa', url: '/images/la-cay-da.jpg', description: 'Ảnh mẫu vật lá cây đa' }
  ]);

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifact-images" isCollapsed={isCollapsed} />
        <Header activeSection="artifact-images" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Artifact Images Management</h1>
              <p className="page-description">Quản lý hình ảnh mẫu vật</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary"><i className="fas fa-plus"></i> Thêm mới hình ảnh</button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên ảnh</th>
                    <th>Mẫu vật</th>
                    <th>URL</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map(img => (
                    <tr key={img.image_id}>
                      <td>{img.name}</td>
                      <td>{img.artifact}</td>
                      <td>{img.url}</td>
                      <td>{img.description}</td>
                      <td>
                        <button className="btn btn-sm btn-edit" title="Sửa"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-sm btn-delete" title="Xóa"><i className="fas fa-trash"></i></button>
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

export default ArtifactImagesPage;