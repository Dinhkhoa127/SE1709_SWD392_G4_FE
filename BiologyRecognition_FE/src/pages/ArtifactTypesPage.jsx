import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

const ArtifactTypesPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [artifactTypes] = useState([
    { artifact_type_id: 1, artifact: 'Lá cây đa', name: 'Lá', type: 'Plant Part', artifactURL: '/images/la-cay-da.jpg', description: 'Loại lá cây đa' }
  ]);

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifact-types" isCollapsed={isCollapsed} />
        <Header activeSection="artifact-types" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Artifact Types Management</h1>
              <p className="page-description">Quản lý các loại mẫu vật</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary"><i className="fas fa-plus"></i> Thêm mới loại mẫu vật</button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên loại</th>
                    <th>Mẫu vật</th>
                    <th>Loại</th>
                    <th>URL</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {artifactTypes.map(type => (
                    <tr key={type.artifact_type_id}>
                      <td>{type.name}</td>
                      <td>{type.artifact}</td>
                      <td>{type.type}</td>
                      <td>{type.artifactURL}</td>
                      <td>{type.description}</td>
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

export default ArtifactTypesPage;