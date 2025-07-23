import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserThunk } from '../redux/thunks/userThunks';
import { getRoleDisplayName } from '../utils/roleUtils';
import '../styles/EditModal.css';

const ManagePermissionModal = ({ show, onClose, user, onSuccess }) => {
  const dispatch = useDispatch();
  const { updating } = useSelector(state => state.user);
  
  const [selectedRole, setSelectedRole] = useState(user?.roleId || 1);
  const [note, setNote] = useState('');

  const roles = [
    { id: 1, name: 'Người dùng', description: 'Quyền truy cập cơ bản' },
    { id: 3, name: 'Quản trị viên', description: 'Quyền quản trị toàn hệ thống' },
    { id: 2, name: 'Chờ cấp quyền', description: 'Tài khoản chưa được phê duyệt' }
  ];

  useEffect(() => {
    if (user) {
      setSelectedRole(user.roleId || 1);
      setNote('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const updateData = {
        id: user.id,
        roleId: selectedRole,
        note: note.trim() || undefined
      };

      const result = await dispatch(updateUserThunk(updateData));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`Đã cập nhật quyền cho ${user.fullName || user.email}`);
        onSuccess?.();
        onClose();
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật quyền');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Có lỗi xảy ra khi cập nhật quyền');
    }
  };

  if (!show || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-user-shield"></i>
            Quản lý quyền truy cập
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* User Info */}
            <div className="user-info-section">
              <h3>Thông tin người dùng</h3>
              <div className="user-info-card">
                <div className="user-avatar">
                  <img 
                    src={user.avatar || 'https://via.placeholder.com/60'} 
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60?text=' + 
                        (user.fullName ? user.fullName.charAt(0) : 'U');
                    }}
                  />
                </div>
                <div className="user-details">
                  <h4>{user.fullName || user.email}</h4>
                  <p>{user.email}</p>
                  <div className="current-role">
                    <span className="role-badge">
                      <i className="fas fa-user-tag"></i>
                      Quyền hiện tại: {getRoleDisplayName(user.roleId)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-section">
              <h3>Cấp quyền mới</h3>
              <div className="role-selection">
                {roles.map((role) => (
                  <div key={role.id} className="role-option">
                    <label className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={selectedRole === role.id}
                        onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                      />
                      <div className="role-content">
                        <div className="role-header">
                          <span className="role-name">{role.name}</span>
                          {selectedRole === role.id && (
                            <i className="fas fa-check-circle selected-icon"></i>
                          )}
                        </div>
                        <p className="role-description">{role.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="form-section">
              <h3>Ghi chú (tùy chọn)</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thêm ghi chú về việc cấp quyền này..."
                rows="3"
                maxLength="500"
              />
              <small className="form-note">
                {note.length}/500 ký tự
              </small>
            </div>

            {/* Warning */}
            {selectedRole !== user.roleId && (
              <div className="warning-section">
                <div className="warning-box">
                  <i className="fas fa-exclamation-triangle"></i>
                  <div>
                    <strong>Lưu ý:</strong>
                    <p>
                      Thay đổi quyền sẽ có hiệu lực ngay lập tức. 
                      Người dùng có thể cần đăng nhập lại để cập nhật quyền mới.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i>
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={updating || selectedRole === user.roleId}
            >
              {updating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Cập nhật quyền
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePermissionModal;
