import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserThunk } from '../redux/thunks/userThunks';
import '../styles/CreateModal.css';

const EditModalUser = ({ open, onClose, userInfo }) => {
    const dispatch = useDispatch();
    const { updating } = useSelector(state => state.user);
    
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        roleId: 1, // Default to Admin role
        isActive: true,
        password: ''
    });

    const [errors, setErrors] = useState({});

    // Populate form with user data when modal opens
    useEffect(() => {
        if (userInfo && open) {
            console.log('EditModalUser - userInfo received:', userInfo); // Debug log
            setForm({
                fullName: userInfo.fullName || '',
                email: userInfo.email || '',
                phone: userInfo.phone || '',
                roleId: userInfo.roleId !== undefined ? userInfo.roleId : 1, // Default to Admin if not specified
                isActive: userInfo.isActive !== undefined ? userInfo.isActive : true,
                password: '' 
            });
        }
    }, [userInfo, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        
        setForm({ ...form, [name]: fieldValue });
        
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
        if (form.roleId === '' || form.roleId === null || form.roleId === undefined) {
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

        if (!userInfo || !userInfo.userAccountId) {
            toast.error('Không thể xác định người dùng cần cập nhật');
            return;
        }

        try {
            const updateData = {
                userAccountId: userInfo.userAccountId,
                password: form.password || "string", // Gửi password nếu có, nếu không thì gửi "string" như API spec
                fullName: form.fullName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim().replace(/\s+/g, ''),
                roleId: parseInt(form.roleId),
                isActive: form.isActive
            };

            console.log('Updating user with data:', updateData); // Debug log
            console.log('User info:', userInfo); // Debug log
            
            await dispatch(updateUserThunk({ 
                userId: userInfo.userAccountId, 
                data: updateData 
            }));
            toast.success('Cập nhật tài khoản thành công!');
            handleClose();
        } catch (error) {
            console.error('Error updating user:', error); // Debug log
            console.error('Error response:', error.response); // Debug log
            
            // Xử lý lỗi 400 - Bad Request
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                console.error('400 Error details:', errorData); // Debug log
                
                let errorMessage = 'Dữ liệu không hợp lệ. ';
                if (errorData?.message) {
                    errorMessage += errorData.message;
                } else if (errorData?.errors) {
                    // Xử lý validation errors từ server
                    const errorFields = Object.keys(errorData.errors);
                    errorMessage += errorFields.map(field => errorData.errors[field]).join(', ');
                } else {
                    errorMessage += 'Vui lòng kiểm tra lại thông tin đã nhập.';
                }
                toast.error(errorMessage);
                return;
            }
            
            // Xử lý lỗi 500 tương tự như create
            if (error.response?.status === 500) {
                toast.warning('Tài khoản có thể đã được cập nhật thành công. Vui lòng kiểm tra danh sách người dùng.');
                handleClose();
                return;
            }
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Có lỗi xảy ra khi cập nhật tài khoản';
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        setForm({
            fullName: '',
            email: '',
            phone: '',
            roleId: 1, // Default to Admin
            isActive: true,
            password: ''
        });
        setErrors({});
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">
                    <i className="fas fa-user-edit"></i>
                    Chỉnh sửa tài khoản
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
                            <option value="3">Lecturer</option>
                        </select>
                        {errors.roleId && <span className="error-message">{errors.roleId}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label>
                            <i className="fas fa-lock"></i>
                            Mật khẩu mới (để trống nếu không thay đổi)
                        </label>
                        <input 
                            type="password"
                            name="password" 
                            value={form.password} 
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới (tùy chọn)"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="checkbox-label">
                            <input 
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            <i className="fas fa-toggle-on"></i>
                            Tài khoản hoạt động
                        </label>
                    </div>

                

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={handleClose}
                            disabled={updating}
                        >
                            <i className="fas fa-times"></i>
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create" 
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
                                    Cập nhật
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="create-modal-note">
                    <i className="fas fa-info-circle"></i>
                    <p>
                        <strong>Lưu ý:</strong> Thông tin cập nhật sẽ có hiệu lực ngay lập tức. 
                        Nếu thay đổi trạng thái tài khoản, người dùng có thể bị ảnh hưởng quyền truy cập.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditModalUser;
