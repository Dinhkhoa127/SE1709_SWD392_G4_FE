import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateMyInfoThunk } from '../redux/thunks/userThunks';
import '../styles/EditModal.css';

const EditProfileModal = ({ show, onClose, user }) => {
  const dispatch = useDispatch();
  const { updating } = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});

  // Kiểm tra xem user có phải Admin không
  const isAdmin = user && (user.role === 1 || user.role === "1");

  useEffect(() => {
    if (user && show) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setErrors({});
    }
  }, [user, show]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Tên đầy đủ không được để trống';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(updateMyInfoThunk(formData));
      
      if (result && result.success) {
        toast.success('Cập nhật thông tin thành công!');
        
        // Đóng modal sau khi update thành công
        setTimeout(() => {
          onClose();
        }, 500); // Delay nhỏ để user thấy toast message
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Hiển thị lỗi chi tiết
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Có lỗi xảy ra khi cập nhật thông tin';
      
      toast.error(`Lỗi: ${errorMessage}`);
      
      // Nếu lỗi 401, có thể cần đăng nhập lại
      if (error.response?.status === 401) {
        toast.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // Có thể redirect về login sau vài giây
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-user-edit"></i>
            Chỉnh sửa thông tin cá nhân
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {isAdmin && (
              <div className="admin-warning" style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '20px',
                color: '#856404'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                <strong>Lưu ý:</strong> Tài khoản Admin không thể tự cập nhật thông tin cá nhân. 
                Vui lòng liên hệ quản trị viên khác để được hỗ trợ.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="fullName">
                <i className="fas fa-user"></i>
                Tên đầy đủ *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
                placeholder="Nhập tên đầy đủ"
                disabled={isAdmin}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Nhập địa chỉ email"
                disabled={isAdmin}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <i className="fas fa-phone"></i>
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                placeholder="Nhập số điện thoại"
                disabled={isAdmin}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-note">
              <i className="fas fa-info-circle"></i>
              <span>Các trường có dấu (*) là bắt buộc</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i>
              {isAdmin ? 'Đóng' : 'Hủy'}
            </button>
            {!isAdmin && (
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={updating}
              >
                {updating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Lưu thay đổi
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
