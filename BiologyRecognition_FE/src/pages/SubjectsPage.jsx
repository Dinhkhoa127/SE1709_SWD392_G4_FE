import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModal from '../components/CreateModal.jsx';
import EditModal from '../components/EditModal.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

const SubjectsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const subjects = [
    { subject_id: 1, name: 'Sinh học tế bào', description: 'Nghiên cứu về cấu trúc và chức năng tế bào', CreatedDate: '2024-01-15', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-16', status: 'active' },
    { subject_id: 2, name: 'Thực vật học', description: 'Nghiên cứu về thực vật và hệ sinh thái', CreatedDate: '2024-01-20', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-21', status: 'active' }
  ];

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="subjects" isCollapsed={isCollapsed} />
        <Header activeSection="subjects" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Subjects Management</h1>
              <p className="page-description">Quản lý các môn học sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                <i className="fas fa-plus"></i> Thêm mới môn học
              </button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên môn học</th>
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
                  {subjects.map(subject => (
                    <tr key={subject.subject_id}>
                      <td>{subject.name}</td>
                      <td>{subject.description}</td>
                      <td>{subject.CreatedDate}</td>
                      <td>{subject.CreatedBy}</td>
                      <td>{subject.ModifiedBy}</td>
                      <td>{subject.ModifiedDate}</td>
                      <td>
                        <span className={`status-badge ${subject.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {subject.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-edit"
                          title="Sửa"
                          onClick={() => setShowEdit(true)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-delete" title="Xóa" onClick={() => setShowDelete(true)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CreateModal open={showCreate} onClose={() => setShowCreate(false)} />
            <EditModal open={showEdit} onClose={() => setShowEdit(false)} />
            <DeleteModal
              open={showDelete}
              onClose={() => setShowDelete(false)}
              onConfirm={() => { /* Xử lý xóa */ setShowDelete(false); }}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default SubjectsPage;