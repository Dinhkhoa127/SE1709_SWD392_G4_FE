import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUserSuccess } from '../redux/actions/userActions';
import { navigateByRole } from '../utils/roleUtils';
import { getCurrentUserAPI } from '../redux/services/apiService';
import '../styles/GoogleCallback.css';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const processGoogleCallback = async () => {
            try {
                // Lấy các params từ URL
                const token = searchParams.get('token') || searchParams.get('accessToken');
                const userData = searchParams.get('user');
                const errorParam = searchParams.get('error');

                console.log('Google callback params:', { token, userData, errorParam });

                if (errorParam) {
                    setError('Đăng nhập Google thất bại: ' + errorParam);
                    setIsProcessing(false);
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                // Trường hợp 1: Có cả token và userData
                if (token && userData) {
                    try {
                        const user = JSON.parse(decodeURIComponent(userData));
                        await handleUserLogin(user, token);
                        return;
                    } catch (parseError) {
                        console.error('Error parsing user data:', parseError);
                    }
                }

                // Trường hợp 2: Chỉ có token, cần fetch user info
                if (token) {
                    try {
                        // Lưu token trước
                        localStorage.setItem('accessToken', token);
                        
                        // Fetch thông tin user từ API
                        const userResponse = await getCurrentUserAPI();
                        const user = userResponse.data || userResponse;
                        
                        await handleUserLogin(user, token);
                        return;
                    } catch (apiError) {
                        console.error('Error fetching user info:', apiError);
                        setError('Không thể lấy thông tin người dùng từ server');
                    }
                }

                // Trường hợp 3: Không có thông tin cần thiết
                setError('Không nhận được thông tin đăng nhập từ Google');
                setIsProcessing(false);
                setTimeout(() => navigate('/login'), 2000);

            } catch (error) {
                console.error('Error processing Google callback:', error);
                setError('Có lỗi xảy ra khi xử lý đăng nhập Google');
                setIsProcessing(false);
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        const handleUserLogin = async (user, token) => {
            try {
                console.log('Processing user login:', user);
                
                // Lưu thông tin user vào localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('accessToken', token);
                
                // Lưu thông tin user vào Redux store
                dispatch(fetchCurrentUserSuccess(user));
                
                // Kiểm tra roleId và chuyển hướng
                console.log('User roleId:', user.roleId);
                
                if (user.roleId) {
                    navigateByRole(user.roleId, navigate);
                    setIsProcessing(false);
                } else {
                    // Nếu không có roleId, mặc định về admin
                    console.warn('No roleId found, defaulting to admin');
                    navigate('/admin', { replace: true });
                    setIsProcessing(false);
                }
            } catch (error) {
                console.error('Error handling user login:', error);
                throw error;
            }
        };

        processGoogleCallback();
    }, [searchParams, navigate, dispatch]);

    if (isProcessing) {
        return (
            <div className="google-callback-container">
                <div className="callback-content">
                    <div className="callback-icon processing">
                        <i className="fas fa-spinner"></i>
                    </div>
                    <h2 className="callback-title">Đang xử lý đăng nhập Google</h2>
                    <p className="callback-message">Vui lòng chờ trong giây lát, chúng tôi đang xác thực thông tin của bạn</p>
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="google-callback-container">
                <div className="callback-content">
                    <div className="callback-icon error">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2 className="callback-title">Lỗi đăng nhập</h2>
                    <p className="callback-message">{error}</p>
                    <p className="callback-submessage">Đang chuyển về trang đăng nhập...</p>
                </div>
            </div>
        );
    }

    return null;
};

export default GoogleCallback;
