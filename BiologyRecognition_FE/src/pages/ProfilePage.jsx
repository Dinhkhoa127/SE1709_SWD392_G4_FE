import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { formatDate } from '../utils/dateUtils';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { currentUser, loadingUsers, usersError } = useSelector((state) => state.user || {});

  useEffect(() => {
    // Fetch current user data if not available
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  if (loadingUsers) {
    return (
      <div className="profile-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="profile-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>Có lỗi xảy ra khi tải thông tin: {usersError}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="profile-error">
        <i className="fas fa-user-slash"></i>
        <p>Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className="profile-container">
        {/* Header */}
        <header className="profile-header">
          <h1 className="profile-title">
            <i className="fas fa-user-circle"></i>
            Thông tin cá nhân
          </h1>
          <p className="profile-subtitle">
            Xem và quản lý thông tin tài khoản của bạn
          </p>
        </header>

        {/* Main Content */}
        <main className="profile-main-content">
          {/* Profile Card */}
          <section className="profile-card">
            {/* User Header */}
            <div className="profile-user-header">
              <div className="profile-avatar-container">
                <div className="profile-avatar-large">
                  {currentUser.fullName 
                    ? currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
                    : (currentUser.username ? currentUser.username.slice(0, 2).toUpperCase() : 'U')
                  }
                </div>
                <div className="profile-status-indicator">
                  <span className={`status-dot ${currentUser.isActive ? 'active' : 'inactive'}`}></span>
                </div>
              </div>
              <div className="profile-user-info">
                <h2 className="profile-user-name">
                  {currentUser.fullName || currentUser.username || 'Chưa có tên'}
                </h2>
                <p className="profile-user-role">
                  <i className="fas fa-shield-alt"></i>
                  {currentUser.role || 'Administrator'}
                </p>
                <span className={`profile-status-badge ${currentUser.isActive ? 'active' : 'inactive'}`}>
                  {currentUser.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              {/* Personal Information */}
              <div className="profile-section">
                <h3 className="section-title">
                  <i className="fas fa-address-card"></i>
                  Thông tin cá nhân
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-user"></i>
                      Tên đầy đủ
                    </label>
                    <div className="detail-value">
                      {currentUser.fullName || 'Chưa cập nhật'}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-envelope"></i>
                      Email
                    </label>
                    <div className="detail-value">
                      {currentUser.email || 'Chưa cập nhật'}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-phone"></i>
                      Số điện thoại
                    </label>
                    <div className="detail-value">
                      {currentUser.phone || 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="profile-section">
                <h3 className="section-title">
                  <i className="fas fa-user-cog"></i>
                  Thông tin tài khoản
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-calendar-plus"></i>
                      Ngày tạo tài khoản
                    </label>
                    <div className="detail-value">
                      {formatDate(currentUser.createdDate)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-calendar-edit"></i>
                      Lần cập nhật cuối
                    </label>
                    <div className="detail-value">
                      {formatDate(currentUser.modifiedDate)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-toggle-on"></i>
                      Trạng thái tài khoản
                    </label>
                    <div className="detail-value">
                      <span className={`status-badge ${currentUser.isActive ? 'active' : 'inactive'}`}>
                        {currentUser.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Information */}
              {currentUser.lastLogin && (
                <div className="profile-section">
                  <h3 className="section-title">
                    <i className="fas fa-shield-alt"></i>
                    Bảo mật
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-clock"></i>
                        Đăng nhập gần nhất
                      </label>
                      <div className="detail-value">
                        {formatDate(currentUser.lastLogin)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button className="btn btn-primary">
                <i className="fas fa-edit"></i>
                Chỉnh sửa thông tin
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-key"></i>
                Đổi mật khẩu
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
