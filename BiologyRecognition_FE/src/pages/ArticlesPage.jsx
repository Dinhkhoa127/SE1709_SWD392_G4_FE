import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/AdminPage.css';

const ArticlesPage = () => {
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };
  const [articles] = useState([
    { article_id: 1, title: 'Quang hợp ở thực vật', CreatedBy: 'Nguyễn Văn A', CreatedDate: '2024-02-10', ModifiedBy: 'Nguyễn Văn A', ModifiedDate: '2024-02-11', status: 'published' },
    { article_id: 2, title: 'Tế bào động vật', CreatedBy: 'Trần Thị B', CreatedDate: '2024-02-12', ModifiedBy: 'Trần Thị B', ModifiedDate: '2024-02-13', status: 'draft' }
  ]);

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="articles" isCollapsed={isCollapsed} />
        <Header activeSection="articles" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header" style={{ 
              marginBottom: '32px',
              padding: '24px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h1 className="page-title" style={{ 
                fontSize: '34px',
                fontWeight: '800',
                color: '#0c4a6e',
                marginBottom: '8px',
                textShadow: '0 3px 6px rgba(12, 74, 110, 0.3)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}>Quản lý các bài viết giáo dục</h1>
              <p className="page-description" style={{ 
                fontSize: '16px',
                color: '#4a5568',
                marginBottom: '0',
                fontWeight: '500'
              }}>Quản lý và tổ chức các bài viết giáo dục trong hệ thống</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: '24px' }}>
              <button 
                className="btn btn-primary"
                style={{
                  backgroundColor: '#3182ce',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(49, 130, 206, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2c5aa0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3182ce'}
              >
                <i className="fas fa-plus" style={{ fontSize: '13px' }}></i> 
                Thêm mới bài viết
              </button>
            </div>
            <div className="table-responsive" style={{ 
              marginTop: '20px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              overflow: 'auto',
              overflowX: 'auto',
              maxWidth: '100%'
            }}>
              <table className="data-table" style={{ 
                width: '100%',
                minWidth: '1100px',
                borderCollapse: 'collapse',
                fontSize: '14px',
                tableLayout: 'auto'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '250px'
                    }}>Tiêu đề</th>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '120px'
                    }}>Người tạo</th>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '130px'
                    }}>Ngày tạo</th>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '120px'
                    }}>Người sửa cuối</th>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '130px'
                    }}>Ngày sửa cuối</th>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '120px'
                    }}>Trạng thái</th>
                    <th style={{ 
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '120px'
                    }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => (
                    <tr key={article.article_id} style={{ 
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f7fafc'}
                    onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fafafa'}
                    >
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        color: '#2d3748',
                        fontWeight: '500',
                        lineHeight: '1.5'
                      }}>{article.title}</td>
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        color: '#4a5568',
                        fontSize: '13px'
                      }}>{article.CreatedBy}</td>
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        color: '#718096',
                        fontSize: '13px'
                      }}>{article.CreatedDate}</td>
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        color: '#4a5568',
                        fontSize: '13px'
                      }}>{article.ModifiedBy}</td>
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        color: '#718096',
                        fontSize: '13px'
                      }}>{article.ModifiedDate}</td>
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        textAlign: 'center'
                      }}>
                        <span className={`status-badge ${article.status === 'published' ? 'status-active' : 'status-inactive'}`} style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: article.status === 'published' ? '#dcfce7' : '#fef7cd',
                          color: article.status === 'published' ? '#166534' : '#92400e'
                        }}>
                          {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '20px',
                        verticalAlign: 'top',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-sm btn-edit" 
                            title="Sửa"
                            style={{
                              backgroundColor: '#3182ce',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2c5aa0'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3182ce'}
                          >
                            <i className="fas fa-edit" style={{ fontSize: '11px' }}></i>
                            Sửa
                          </button>
                          <button 
                            className="btn btn-sm btn-delete" 
                            title="Xóa"
                            style={{
                              backgroundColor: '#e53e3e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c53030'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#e53e3e'}
                          >
                            <i className="fas fa-trash" style={{ fontSize: '11px' }}></i>
                            Xóa
                          </button>
                        </div>
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
