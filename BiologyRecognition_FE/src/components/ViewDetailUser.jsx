import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByIdThunk } from '../redux/thunks/userThunks';
import { formatDate } from '../utils/dateUtils';
import '../styles/ViewDetail.css';

const ViewDetailUser = ({ userId, onClose }) => {
  const dispatch = useDispatch();
  const { selectedUser, loadingUsers, usersError } = useSelector((state) => state.user || {});

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserByIdThunk(userId));
    }
  }, [dispatch, userId]);

  if (!userId) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
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
          {loadingUsers ? (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Đang tải thông tin người dùng...</p>
            </div>
          ) : usersError ? (
            <div className="error-container">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Có lỗi xảy ra: {usersError}</p>
            </div>
          ) : selectedUser ? (
            <div className="user-detail-content">
              {/* User Avatar and Basic Info */}
              <div className="user-header">
                <div className="user-avatar-large">
                  {selectedUser.fullName 
                    ? selectedUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
                    : 'U'
                  }
                </div>
                <div className="user-basic-info">
                  <h3 className="user-name">{selectedUser.fullName || 'Chưa có tên'}</h3>
                  <span className={`user-status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                    <span className="status-dot"></span>
                    {selectedUser.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
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
                        {selectedUser.email || 'Chưa có email'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <span className="detail-value">
                        {selectedUser.phone || 'Chưa có số điện thoại'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-user"></i>
                        Tên đầy đủ
                      </label>
                      <span className="detail-value">
                        {selectedUser.fullName || 'Chưa có tên'}
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
                        <i className="fas fa-id-badge"></i>
                        ID tài khoản
                      </label>
                      <span className="detail-value">
                        {selectedUser.userAccountId || selectedUser.id || 'N/A'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-plus"></i>
                        Ngày tạo
                      </label>
                      <span className="detail-value">
                        {formatDate(selectedUser.createdDate)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-edit"></i>
                        Ngày cập nhật
                      </label>
                      <span className="detail-value">
                        {formatDate(selectedUser.modifiedDate)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-toggle-on"></i>
                        Trạng thái tài khoản
                      </label>
                      <span className={`status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                        {selectedUser.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedUser.role && (
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
                          {selectedUser.role}
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
              <p>Không tìm thấy thông tin người dùng</p>
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
