import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

const TopicsPage = () => {
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [topics] = useState([
    { topic_id: 1, name: 'Màng tế bào', chapter: 'Cấu trúc tế bào', description: 'Cấu tạo màng tế bào', CreatedDate: '2024-01-18', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-19', status: 'active' },
    { topic_id: 2, name: 'Pha sáng', chapter: 'Quang hợp', description: 'Quá trình hấp thụ ánh sáng', CreatedDate: '2024-01-22', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-23', status: 'active' }
  ]);

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="topics" isCollapsed={isCollapsed} />
        <Header activeSection="topics" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Topics Management</h1>
              <p className="page-description">Quản lý các chủ đề sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary"><i className="fas fa-plus"></i> Thêm mới chủ đề</button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên chủ đề</th>
                    <th>Chương</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Người sửa cuối</th>
                    <th>Ngày sửa cuối</th>
                  
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map(topic => (
                    <tr key={topic.topic_id}>
                      <td>{topic.name}</td>
                      <td>{topic.chapter}</td>
                      <td>{topic.description}</td>
                      <td>{topic.CreatedDate}</td>
                      <td>{topic.CreatedBy}</td>
                      <td>{topic.ModifiedBy}</td>
                      <td>{topic.ModifiedDate}</td>
                     
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

export default TopicsPage;