import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

const UsersPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users] = useState([
    { user_id: 1, Username: 'admin', FullName: 'Quản trị viên', Email: 'admin@mail.com', Phone: '0123456789', RoleId: 1, IsActive: true, CreatedDate: '2024-01-01', ModifiedDate: '2024-01-10' }
  ]);

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="users" isCollapsed={isCollapsed} />
        <Header activeSection="users" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Users Management</h1>
              <p className="page-description">Quản lý tài khoản người dùng</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary"><i className="fas fa-plus"></i> Thêm mới người dùng</button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên đăng nhập</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Quyền</th>
                    <th>Ngày tạo</th>
                    <th>Ngày sửa cuối</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.user_id}>
                      <td>{user.Username}</td>
                      <td>{user.FullName}</td>
                      <td>{user.Email}</td>
                      <td>{user.Phone}</td>
                      <td>{user.RoleId}</td>
                      <td>{user.CreatedDate}</td>
                      <td>{user.ModifiedDate}</td>
                      <td>
                        <span className={`status-badge ${user.IsActive ? 'status-active' : 'status-inactive'}`}>
                          {user.IsActive ? 'Active' : 'Inactive'}
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

export default UsersPage;