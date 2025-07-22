import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUsersThunk, deleteUserThunk } from '../redux/thunks/userThunks';
import { clearUserError } from '../redux/actions/userActions';
import { formatDate } from '../utils/dateUtils';
import ViewDetailUser from '../components/ViewDetailUser';
import '../styles/UsersPage.css';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users = [], loadingUsers, usersError, deleting } = useSelector((state) => state.user || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when component mounts or filters change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = {
          page: currentPage,
          pageSize: usersPerPage,
        };
        
        // Add search term if exists
        if (debouncedSearchTerm.trim()) {
          params.search = debouncedSearchTerm.trim();
        }
        
        // Add status filter if not 'all'
        if (statusFilter !== 'all') {
          params.isActive = statusFilter === 'active';
        }

        const response = await dispatch(fetchUsersThunk(params));
        
        // Update pagination info if response has pagination data
        if (response && response.totalCount !== undefined) {
          setTotalUsers(response.totalCount);
          setTotalPages(Math.ceil(response.totalCount / usersPerPage));
        } else {
          // Fallback for simple array response
          setTotalUsers(users.length);
          setTotalPages(Math.ceil(users.length / usersPerPage));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch, currentPage, usersPerPage, debouncedSearchTerm, statusFilter]);

  // Reset to first page when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Stats calculation with defensive check
  const stats = {
    total: totalUsers || (Array.isArray(users) ? users : []).length,
    active: (Array.isArray(users) ? users : []).filter(u => u?.isActive === true).length,
    inactive: (Array.isArray(users) ? users : []).filter(u => u?.isActive === false).length
  };

  // Helper functions
  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUserId(null);
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await dispatch(deleteUserThunk(userId));
        toast.success('Xóa người dùng thành công!');
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa người dùng!');
      }
    }
  };

  const handleRefresh = () => {
    const params = {
      page: currentPage,
      pageSize: usersPerPage,
    };
    
    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }
    
    if (statusFilter !== 'all') {
      params.isActive = statusFilter === 'active';
    }

    dispatch(fetchUsersThunk(params));
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearUserError());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className="users-management-container">
        {/* Header */}
        <header className="users-header">
          <h1 className="users-title">
            <i className="fas fa-users"></i>
            Quản lý người dùng
          </h1>
          <p className="users-subtitle">
            Quản lý tài khoản và quyền truy cập của người dùng trong hệ thống
          </p>
        </header>

        {/* Main Content */}
        <main className="users-main-content">
          {/* Stats Cards */}
          <section className="users-stats fade-in">
            <div className="stat-card">
              <div className="stat-card-header">
                <h3 className="stat-card-title">Tổng số người dùng</h3>
                <div className="stat-card-icon total">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <p className="stat-card-value">{stats.total}</p>
              <div className="stat-card-change positive">
                <i className="fas fa-arrow-up"></i>
                Tổng số người dùng
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3 className="stat-card-title">Đang hoạt động</h3>
                <div className="stat-card-icon active">
                  <i className="fas fa-user-check"></i>
                </div>
              </div>
              <p className="stat-card-value">{stats.active}</p>
              <div className="stat-card-change positive">
                <i className="fas fa-check-circle"></i>
                Tài khoản kích hoạt
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3 className="stat-card-title">Vô hiệu hóa</h3>
                <div className="stat-card-icon inactive">
                  <i className="fas fa-user-times"></i>
                </div>
              </div>
              <p className="stat-card-value">{stats.inactive}</p>
              <div className="stat-card-change negative">
                <i className="fas fa-ban"></i>
                Tài khoản vô hiệu hóa
              </div>
            </div>
          </section>

          {/* Controls */}
          <section className="users-controls slide-in">
            <div className="controls-header">
              <h2 className="controls-title">Danh sách người dùng</h2>
              <div className="controls-actions">
                <button 
                  className="users-btn users-btn-outline" 
                  onClick={handleRefresh}
                  disabled={loadingUsers}
                >
                  <i className={`fas ${loadingUsers ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
                  Làm mới
                </button>
              </div>
            </div>

            <div className="search-filter-section">
              <div className="search-group">
                <label htmlFor="search">Tìm kiếm</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    id="search"
                    className="search-input"
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="status-filter">Trạng thái tài khoản</label>
                <select
                  id="status-filter"
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Kích hoạt</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>
            </div>
          </section>

          {/* Error Display */}
          {usersError && (
            <div className="users-error">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{usersError}</span>
              <button onClick={() => dispatch(clearUserError())}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Users Table */}
          <section className="users-table-container fade-in">
            {loadingUsers ? (
              <div className="users-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Đang tải danh sách người dùng...</p>
              </div>
            ) : users.length > 0 ? (
              <>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Tên đầy đủ</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Ngày tạo</th>
                      <th>Ngày chỉnh sửa</th>
                      <th>Trạng thái tài khoản</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.userAccountId || user.id}>
                        <td>
                          <div className="user-name-cell">
                            <div className="user-avatar">
                              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                            </div>
                            <span className="user-fullname">{user.fullName || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <i className="fas fa-envelope contact-icon"></i>
                            <span>{user.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <i className="fas fa-phone contact-icon"></i>
                            <span>{user.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <i className="fas fa-calendar-plus date-icon"></i>
                            <span>{formatDate(user.createdDate)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <i className="fas fa-calendar-edit date-icon"></i>
                            <span>{formatDate(user.modifiedDate)}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>
                            <span className="status-dot"></span>
                            {user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                          </span>
                        </td>
                        <td>
                          <div className="user-actions">
                            <button
                              className="action-btn view"
                              title="Xem chi tiết"
                              onClick={() => handleViewUser(user.userAccountId || user.id)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="action-btn edit"
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteUser(user.userAccountId || user.id)}
                              title="Xóa"
                              disabled={deleting}
                            >
                              <i className={`fas ${deleting ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="users-pagination">
                    <div className="pagination-info">
                      Hiển thị trang {currentPage} của {totalPages} ({totalUsers} người dùng)
                    </div>
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page}>...</span>;
                        }
                        return null;
                      })}
                      
                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="users-empty">
                <i className="fas fa-users"></i>
                <h3>Không tìm thấy người dùng</h3>
                <p>Không có người dùng nào phù hợp với bộ lọc hiện tại.</p>
                <button 
                  className="users-btn users-btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <i className="fas fa-refresh"></i>
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </section>
        </main>

        {/* View Detail Modal */}
        {showDetailModal && selectedUserId && (
          <ViewDetailUser
            userId={selectedUserId}
            onClose={handleCloseDetailModal}
          />
        )}
      </div>
    </>
  );
};

export default UsersPage;