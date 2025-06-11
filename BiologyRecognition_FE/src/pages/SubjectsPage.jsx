import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

const SubjectsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subjects] = useState([
    { id: 1, name: 'Sinh học tế bào', description: 'Nghiên cứu về cấu trúc và chức năng tế bào', date: '2024-01-15', status: 'active' },
    { id: 2, name: 'Thực vật học', description: 'Nghiên cứu về thực vật và hệ sinh thái', date: '2024-01-20', status: 'active' },
    { id: 3, name: 'Động vật học', description: 'Nghiên cứu về động vật và sinh thái học', date: '2024-01-25', status: 'inactive' }
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
          activeSection="subjects" // Set the active section to "subjects"
          isCollapsed={isCollapsed} 
          onSectionChange={(section) => console.log(section)} // Optional: handle section change
        />
        <Header 
          activeSection="subjects" 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
        />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Subjects Management</h1>
              <p className="page-description">Quản lý các môn học sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary">
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
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(subject => (
                    <tr key={subject.id}>
                  
                      <td>{subject.name}</td>
                      <td>{subject.description}</td>
                      <td>{subject.date}</td>
                      <td>
                        <span className={`status-badge ${subject.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {subject.status === 'active' ? 'Active' : 'Inactive'}
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

export default SubjectsPage;