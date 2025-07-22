import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { restoreUserFromStorage } from '../redux/thunks/userThunks';
import { hasRoutePermission, navigateByRole, needsPermissionApproval } from '../utils/roleUtils';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Khôi phục thông tin user từ localStorage khi component mount
    if (!currentUser) {
      dispatch(restoreUserFromStorage());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    // Kiểm tra authentication sau khi khôi phục user
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('accessToken');
    
    // Nếu không có dữ liệu trong localStorage, redirect về login
    if (!storedUser || !storedToken) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Nếu có dữ liệu trong localStorage nhưng Redux chưa có currentUser
    // Và không đang loading, thì restore từ localStorage
    if (!currentUser && !loading) {
      dispatch(restoreUserFromStorage());
    }
  }, [currentUser, loading, navigate, dispatch]);

  // Nếu đã có user, kiểm tra quyền truy cập route hiện tại
  useEffect(() => {
    if (currentUser) {
      const currentPath = location.pathname;
      
      // Nếu user cần chờ cấp quyền và không ở trang waiting-permission, chuyển hướng
      if (needsPermissionApproval(currentUser.roleId) && currentPath !== '/waiting-permission') {
        navigate('/waiting-permission', { replace: true });
        return;
      }
      
      // Kiểm tra quyền truy cập route hiện tại
      if (!hasRoutePermission(currentUser.roleId, currentPath)) {
        // Nếu không có quyền, chuyển về trang phù hợp với role
        navigateByRole(currentUser.roleId, navigate);
      }
    }
  }, [currentUser, location.pathname, navigate]);

  // Kiểm tra localStorage trước
  const storedUser = localStorage.getItem('currentUser');
  const storedToken = localStorage.getItem('accessToken');
  
  // Nếu không có dữ liệu trong localStorage, không hiển thị gì
  if (!storedUser || !storedToken) {
    return null;
  }

  // Nếu có localStorage nhưng chưa có currentUser trong Redux, hiển thị loading
  if (!currentUser && (loading || storedUser)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  // Nếu đã có user hoặc có dữ liệu localStorage, kiểm tra quyền truy cập
  if (currentUser || storedUser) {
    const user = currentUser || JSON.parse(storedUser);
    const currentPath = location.pathname;
    
    // Kiểm tra quyền truy cập
    if (!hasRoutePermission(user.roleId, currentPath)) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          fontSize: '18px'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ marginBottom: '10px', fontSize: '24px', color: '#dc3545' }}></i>
          <p>Bạn không có quyền truy cập trang này</p>
          <p style={{ fontSize: '14px', color: '#666' }}>Đang chuyển hướng...</p>
        </div>
      );
    }
    
    return children;
  }

  return null;
};

export default ProtectedRoute;
