import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/AdminPage.css';

const ArticlesPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [articles] = useState([
    { id: 1, title: 'Quang hợp ở thực vật', author: 'Nguyễn Văn A', date: '2024-02-10', status: 'published' },
    { id: 2, title: 'Tế bào động vật', author: 'Trần Thị B', date: '2024-02-12', status: 'draft' }
  ]);

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="articles" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <Header activeSection="articles" isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Articles Management</h1>
              <p className="page-description">Quản lý các bài viết giáo dục</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> Thêm mới bài viết
              </button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id}>
                     
                      <td>{article.title}</td>
                      <td>{article.author}</td>
                      <td>{article.date}</td>
                      <td>
                        <span className={`status-badge ${article.status === 'published' ? 'status-active' : 'status-inactive'}`}>
                          {article.status === 'published' ? 'Published' : 'Draft'}
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

export default ArticlesPage;
