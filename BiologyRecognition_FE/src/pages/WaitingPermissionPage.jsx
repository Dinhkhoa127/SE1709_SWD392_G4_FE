import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/WaitingPermissionPage.css';

const WaitingPermissionPage = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian hiện tại mỗi phút (thay vì mỗi giây để giảm tải)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 phút

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Xóa thông tin user và chuyển về trang login
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Nếu không có user, chuyển về login mà không render gì
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="waiting-permission-container">
      {/* Background Animation */}
      <div className="waiting-bg-animation">
        <div className="floating-leaf leaf-1">🌿</div>
        <div className="floating-leaf leaf-2">🍃</div>
        <div className="floating-leaf leaf-3">🌿</div>
        <div className="floating-leaf leaf-4">🍃</div>
        <div className="floating-leaf leaf-5">🌿</div>
      </div>

      {/* Main Content */}
      <div className="waiting-content">
        {/* Header */}
        <div className="waiting-header">
          <div className="waiting-logo">
            <i className="fas fa-seedling"></i>
          </div>
          <h1>Plant & Biology Recognition System</h1>
          <p className="waiting-subtitle">Hệ thống nhận diện mẫu thực vật và sinh học</p>
        </div>

        {/* Status Card */}
        <div className="waiting-status-card">
          <div className="status-icon">
            <i className="fas fa-clock"></i>
          </div>
          
          <h2>Chờ cấp quyền truy cập</h2>
          
          <div className="user-info">
            <div className="user-avatar">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt="User Avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
            <div className="user-details">
              <h3>{currentUser.fullName || currentUser.email}</h3>
              <p className="user-email">{currentUser.email}</p>
              <div className="user-role">
                <i className="fas fa-user-tag"></i>
                <span>Trạng thái: Chờ cấp quyền</span>
              </div>
            </div>
          </div>

          <div className="waiting-message">
            <p>
              <i className="fas fa-info-circle"></i>
              Tài khoản của bạn đang chờ quản trị viên cấp quyền truy cập vào hệ thống.
            </p>
            <p>
              Vui lòng liên hệ với quản trị viên hoặc chờ được phê duyệt để tiếp tục sử dụng.
            </p>
          </div>

          {/* Current Time */}
          <div className="current-time">
            <i className="fas fa-clock"></i>
            <span>{currentTime.toLocaleString('vi-VN')}</span>
          </div>

          {/* Action Buttons */}
          <div className="waiting-actions">
            <button className="btn btn-refresh" onClick={handleRefresh}>
              <i className="fas fa-sync-alt"></i>
              Kiểm tra lại
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="waiting-instructions">
          <h3>
            <i className="fas fa-question-circle"></i>
            Hướng dẫn
          </h3>
          <ul>
            <li>
              <i className="fas fa-check-circle"></i>
              Tài khoản của bạn đã được tạo thành công
            </li>
            <li>
              <i className="fas fa-clock"></i>
              Đang chờ quản trị viên phê duyệt quyền truy cập
            </li>
            <li>
              <i className="fas fa-refresh"></i>
              Có thể nhấn "Kiểm tra lại" để cập nhật trạng thái
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="waiting-footer">
          <p>© 2025 Plant & Biology Recognition System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingPermissionPage;
