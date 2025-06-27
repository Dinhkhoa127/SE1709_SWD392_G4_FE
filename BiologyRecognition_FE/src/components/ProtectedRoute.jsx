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
    if (!currentUser && !storedUser && !loading) {
      // Nếu không có user và không đang loading, redirect về login
      navigate('/login', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  // Hiển thị loading spinner khi đang kiểm tra authentication
  if (loading || (!currentUser && localStorage.getItem('currentUser'))) {
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

  // Nếu đã có user, hiển thị component con
  if (currentUser) {
    return children;
  }

  // Fallback case
  return null;
};

export default ProtectedRoute;
