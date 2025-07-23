import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByIdThunk } from '../redux/thunks/userThunks';
import { formatDate } from '../utils/dateUtils';
import '../styles/ViewDetail.css';

const ViewDetailUser = ({ userId, userInfo, onClose }) => {
  const dispatch = useDispatch();
  const { selectedUser, loadingUsers, usersError } = useSelector((state) => state.user || {});

  // Use passed userInfo if available, otherwise fetch from API
  const displayUser = userInfo || selectedUser;

  useEffect(() => {
    // Only fetch if we don't have userInfo passed as prop
    if (userId && !userInfo) {
      console.log('Fetching user with ID:', userId); // Debug log
      dispatch(fetchUserByIdThunk(userId)).catch(error => {
        console.error('Error fetching user by ID:', error);
        // If 405 error, we might need to use a different endpoint or method
        if (error.response?.status === 405) {
          console.log('405 error detected - endpoint may not exist or wrong method');
        }
      });
    }
  }, [dispatch, userId, userInfo]);

  // Clear selected user when component unmounts
  useEffect(() => {
    return () => {
      // Optional: clear selected user when closing modal
    };
  }, []);

  // Handle ESC key to close modal and prevent body scroll
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!userId) {
    return null;
  }

  console.log('ViewDetailUser render:', { selectedUser, loadingUsers, usersError }); // Debug log

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-user-circle"></i>
            Thông tin chi tiết người dùng
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {(!userInfo && loadingUsers) ? (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Đang tải thông tin người dùng...</p>
            </div>
          ) : (!userInfo && usersError) ? (
            <div className="error-container">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Có lỗi xảy ra khi tải thông tin người dùng</h3>
              <p>Chi tiết lỗi: {usersError}</p>
              {usersError.includes('405') && (
                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                  <p><strong>Lỗi 405 - Method Not Allowed:</strong></p>
                  <p>• API endpoint có thể chưa được implement</p>
                  <p>• HTTP method không được hỗ trợ</p>
                  <p>• Đường dẫn API có thể không chính xác</p>
                </div>
              )}
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={onClose}>
                  <i className="fas fa-times"></i>
                  Đóng
                </button>
                {!userInfo && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => dispatch(fetchUserByIdThunk(userId))}
                  >
                    <i className="fas fa-refresh"></i>
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          ) : displayUser ? (
            <div className="user-detail-content">
              {/* User Avatar and Basic Info */}
              <div className="user-header">
                <div className="user-avatar-large">
                  {displayUser.fullName 
                    ? displayUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
                    : 'U'
                  }
                </div>
                <div className="user-basic-info">
                  <h3 className="user-name">{displayUser.fullName || 'Chưa có tên'}</h3>
                  <span className={`user-status-badge ${displayUser.isActive ? 'active' : 'inactive'}`}>
                    <span className="status-dot"></span>
                    {displayUser.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                  </span>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="user-details-grid">
                {/* Contact Information */}
                <div className="detail-section">
                  <h4 className="section-title">
                    <i className="fas fa-address-card"></i>
                    Thông tin liên hệ
                  </h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <span className="detail-value">
                        {displayUser.email || 'Chưa có email'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <span className="detail-value">
                        {displayUser.phone || 'Chưa có số điện thoại'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-user"></i>
                        Tên đầy đủ
                      </label>
                      <span className="detail-value">
                        {displayUser.fullName || 'Chưa có tên'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="detail-section">
                  <h4 className="section-title">
                    <i className="fas fa-user-cog"></i>
                    Thông tin tài khoản
                  </h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-plus"></i>
                        Ngày tạo
                      </label>
                      <span className="detail-value">
                        {formatDate(displayUser.createdDate)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-edit"></i>
                        Ngày cập nhật
                      </label>
                      <span className="detail-value">
                        {formatDate(displayUser.modifiedDate)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-toggle-on"></i>
                        Trạng thái tài khoản
                      </label>
                      <span className={`status-badge ${displayUser.isActive ? 'active' : 'inactive'}`}>
                        {displayUser.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {displayUser.role && (
                  <div className="detail-section">
                    <h4 className="section-title">
                      <i className="fas fa-user-shield"></i>
                      Quyền hạn
                    </h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-shield-alt"></i>
                          Vai trò
                        </label>
                        <span className="detail-value role-badge">
                          {displayUser.role}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-data-container">
              <i className="fas fa-user-slash"></i>
              <h3>Không tìm thấy thông tin người dùng</h3>
              <p>Dữ liệu người dùng không tồn tại hoặc chưa được tải.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // If we have userInfo, no need to fetch again
                  if (userInfo) {
                    console.log('User info already available, no need to fetch');
                    return;
                  }
                  // Otherwise try to fetch again
                  dispatch(fetchUserByIdThunk(userId));
                }}
              >
                <i className="fas fa-refresh"></i>
                {userInfo ? 'Dữ liệu đã có sẵn' : 'Thử lại'}
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailUser;
