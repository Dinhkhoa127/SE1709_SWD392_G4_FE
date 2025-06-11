import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

const ArtifactsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [artifacts] = useState([
    { artifact_id: 1, name: 'Lá cây đa', topic: 'Quang hợp', description: 'Mẫu lá cây đa', scientific_name: 'Ficus benghalensis', CreatedDate: '2024-02-01', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-02-02', status: 'active' },
    { artifact_id: 2, name: 'Tế bào gan', topic: 'Cấu trúc tế bào', description: 'Mẫu tế bào gan', scientific_name: 'Hepatocyte', CreatedDate: '2024-02-03', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-02-04', status: 'active' }
  ]);

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifacts" isCollapsed={isCollapsed} />
        <Header activeSection="artifacts" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Artifacts Management</h1>
              <p className="page-description">Quản lý các mẫu vật sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary"><i className="fas fa-plus"></i> Thêm mới mẫu vật</button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên mẫu vật</th>
                    <th>Chủ đề</th>
                    <th>Tên khoa học</th>
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
                  {artifacts.map(artifact => (
                    <tr key={artifact.artifact_id}>
                      <td>{artifact.name}</td>
                      <td>{artifact.topic}</td>
                      <td>{artifact.scientific_name}</td>
                      <td>{artifact.description}</td>
                      <td>{artifact.CreatedDate}</td>
                      <td>{artifact.CreatedBy}</td>
                      <td>{artifact.ModifiedBy}</td>
                      <td>{artifact.ModifiedDate}</td>
                      <td>
                        <span className={`status-badge ${artifact.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {artifact.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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

export default ArtifactsPage;