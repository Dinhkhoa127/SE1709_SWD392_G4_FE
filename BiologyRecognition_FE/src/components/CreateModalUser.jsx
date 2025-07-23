import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createUserThunk } from '../redux/thunks/userThunks';
import '../styles/CreateModal.css';

const CreateModalUser = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { creating } = useSelector(state => state.user);
    
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        roleId: 1 // Default to Admin role
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate fullName
        if (!form.fullName.trim()) {
            newErrors.fullName = 'Họ và tên là bắt buộc';
        } else if (form.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
        }

        // Validate email
        if (!form.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        }

        // Validate phone
        if (!form.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(form.phone.replace(/\s+/g, ''))) {
                newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
            }
        }

        // Validate roleId
        if (form.roleId === '' || form.roleId < 0) {
            newErrors.roleId = 'Vui lòng chọn vai trò';
        } else {
            const roleIdNum = parseInt(form.roleId);
            if (isNaN(roleIdNum) || (roleIdNum !== 1 && roleIdNum !== 3)) {
                newErrors.roleId = 'Vai trò không hợp lệ (chỉ chấp nhận Admin hoặc Lecture)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const userData = {
                fullName: form.fullName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim().replace(/\s+/g, ''),
                roleId: parseInt(form.roleId)
            };

            console.log('Creating user with data:', userData); // Debug log
            await dispatch(createUserThunk(userData));
            toast.success('Tạo tài khoản thành công!');
            handleClose();
        } catch (error) {
            console.error('Error creating user:', error); // Debug log
            
            // Kiểm tra nếu có response data thành công nhưng status lỗi
            if (error.response?.status === 500) {
                // Có thể user đã được tạo thành công, hiển thị thông báo khác
                toast.warning('Tài khoản có thể đã được tạo thành công. Vui lòng kiểm tra danh sách người dùng.');
                handleClose();
                return;
            }
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Có lỗi xảy ra khi tạo tài khoản';
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        setForm({
            fullName: '',
            email: '',
            phone: '',
            roleId: 1 // Default to Admin
        });
        setErrors({});
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">
                    <i className="fas fa-user-plus"></i>
                    Tạo tài khoản mới
                </div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                
                <form className="create-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group full-width">
                        <label>
                            <i className="fas fa-user"></i>
                            Họ và tên *
                        </label>
                        <input 
                            type="text"
                            name="fullName" 
                            value={form.fullName} 
                            onChange={handleChange}
                            placeholder="Nhập họ và tên đầy đủ"
                            className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label>
                            <i className="fas fa-envelope"></i>
                            Email *
                        </label>
                        <input 
                            type="email"
                            name="email" 
                            value={form.email} 
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ email"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label>
                            <i className="fas fa-phone"></i>
                            Số điện thoại *
                        </label>
                        <input 
                            type="tel"
                            name="phone" 
                            value={form.phone} 
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại (10-11 chữ số)"
                            className={errors.phone ? 'error' : ''}
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label>
                            <i className="fas fa-user-tag"></i>
                            Vai trò *
                        </label>
                        <select 
                            name="roleId" 
                            value={form.roleId} 
                            onChange={handleChange}
                            className={errors.roleId ? 'error' : ''}
                        >
                            <option value="">Chọn vai trò</option>
                            <option value="1">Admin</option>
                            <option value="3">Lecture</option>
                        </select>
                        {errors.roleId && <span className="error-message">{errors.roleId}</span>}
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={handleClose}
                            disabled={creating}
                        >
                            <i className="fas fa-times"></i>
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create" 
                            disabled={creating}
                        >
                            {creating ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus"></i>
                                    Tạo tài khoản
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="create-modal-note">
                    <i className="fas fa-info-circle"></i>
                    <p>
                        <strong>Lưu ý:</strong> Mật khẩu mặc định sẽ được gửi qua email đã đăng ký. 
                        Người dùng có thể thay đổi mật khẩu sau khi đăng nhập lần đầu.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateModalUser;
