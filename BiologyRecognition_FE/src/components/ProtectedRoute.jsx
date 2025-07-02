import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { restoreUserFromStorage } from '../redux/thunks/userThunks';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Nếu đã có user hoặc có dữ liệu localStorage, hiển thị component con
  if (currentUser || storedUser) {
    return children;
  }

  return null;
};

export default ProtectedRoute;
