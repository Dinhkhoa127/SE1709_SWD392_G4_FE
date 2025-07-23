import {
  fetchCurrentUserRequest,
  fetchCurrentUserSuccess,
  fetchCurrentUserFailure,
  logoutUser,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  setSelectedUser,
  updateMyInfoRequest,
  updateMyInfoSuccess,
  updateMyInfoFailure
} from '../actions/userActions';

import {
  getCurrentUserAPI,
  getUsersAPI,
  getUserByIdAPI,
  createUserAPI,
  updateUserAPI,
  updateMyInfoAPI,
  deleteUserAPI
} from '../services/apiService';

// Restore user from localStorage
export const restoreUserFromStorage = () => {
  return (dispatch) => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('accessToken');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        // Trực tiếp dispatch success action mà không qua request (không set loading)
        dispatch(fetchCurrentUserSuccess(userData));
      }
    } catch (error) {
      // Clear corrupted data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
    }
  };
};

// Current User Thunk
export const fetchCurrentUser = () => {
  return async (dispatch) => {
    dispatch(fetchCurrentUserRequest());
    try {
      const response = await getCurrentUserAPI();
      dispatch(fetchCurrentUserSuccess(response.data || response));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch current user';
      dispatch(fetchCurrentUserFailure(errorMessage));
    }
  };
};

// Users Management Thunks
// Fetch all users with pagination
export const fetchUsersThunk = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchUsersRequest());
    
    try {
      const response = await getUsersAPI(params);
      const users = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      dispatch(fetchUsersSuccess(users));
      return response; // Return full response to get pagination info
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách người dùng';
      dispatch(fetchUsersFailure(errorMessage));
      throw error;
    }
  };
};

// Fetch user by ID
export const fetchUserByIdThunk = (userId) => {
  return async (dispatch) => {
    dispatch(fetchUserByIdRequest());
    
    try {
      const response = await getUserByIdAPI(userId);
      dispatch(fetchUserByIdSuccess(response.data || response));
      dispatch(setSelectedUser(response.data || response));
      return response.data || response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải thông tin người dùng';
      dispatch(fetchUserByIdFailure(errorMessage));
      throw error;
    }
  };
};

// Create new user
export const createUserThunk = (userData) => {
  return async (dispatch) => {
    dispatch(createUserRequest());
    
    try {
      const response = await createUserAPI(userData);
      console.log('Create user response:', response); // Debug log
      
      dispatch(createUserSuccess(response.data || response));
      
      // Refresh users list after create
      dispatch(fetchUsersThunk());
      
      return response.data || response;
    } catch (error) {
      console.error('Create user error:', error); // Debug log
      
      // Nếu lỗi 500 nhưng có thể user đã được tạo, vẫn refresh danh sách
      if (error.response?.status === 500) {
        console.log('Server error 500, refreshing user list to check if user was created');
        // Refresh để kiểm tra xem user có được tạo không
        setTimeout(() => {
          dispatch(fetchUsersThunk());
        }, 1000);
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Lỗi khi tạo người dùng';
      dispatch(createUserFailure(errorMessage));
      throw error;
    }
  };
};

// Update user
export const updateUserThunk = ({ userId, data }) => {
  return async (dispatch) => {
    dispatch(updateUserRequest());
    
    try {
      // Gửi data đúng format theo API spec
      const updateData = {
        userAccountId: userId,
        password: data.password || "string", // API yêu cầu password field
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId,
        isActive: data.isActive
      };
      
      console.log('Update user thunk - userId:', userId); // Debug log
      console.log('Update user thunk - data:', updateData); // Debug log
      
      const response = await updateUserAPI(updateData);
      const updatedUser = response.data || response;
      
      console.log('Update user response:', updatedUser); // Debug log
      
      dispatch(updateUserSuccess(updatedUser));
      
      // Refresh users list after update
      dispatch(fetchUsersThunk());
      
      return updatedUser;
    } catch (error) {
      console.error('Update user thunk error:', error); // Debug log
      console.error('Update user thunk error response:', error.response); // Debug log
      
      // Nếu lỗi 500 nhưng có thể user đã được cập nhật, vẫn refresh danh sách
      if (error.response?.status === 500) {
        console.log('Server error 500, refreshing user list to check if user was updated');
        // Refresh để kiểm tra xem user có được cập nhật không
        setTimeout(() => {
          dispatch(fetchUsersThunk());
        }, 1000);
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Lỗi khi cập nhật người dùng';
      dispatch(updateUserFailure(errorMessage));
      throw error;
    }
  };
};

// Delete user
export const deleteUserThunk = (userId) => {
  return async (dispatch) => {
    dispatch(deleteUserRequest());
    
    try {
      await deleteUserAPI(userId);
      dispatch(deleteUserSuccess(userId));
      
      // Refresh users list after delete
      dispatch(fetchUsersThunk());
      
      return userId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa người dùng';
      dispatch(deleteUserFailure(errorMessage));
      throw error;
    }
  };
};

// Update my info
export const updateMyInfoThunk = (data) => {
  return async (dispatch, getState) => {
    dispatch(updateMyInfoRequest());
    
    try {
      console.log('Update my info thunk - data:', data); // Debug log
      
      // Kiểm tra role của user hiện tại
      const currentUser = getState().user.currentUser;
      if (!currentUser) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      }
      
      // Nếu là Admin (role 1), sử dụng endpoint admin
      if (currentUser.role === 1 || currentUser.role === "1") {
        console.log('Admin user detected, cannot use me/info endpoint');
        throw new Error('Tài khoản Admin không thể sử dụng chức năng này. Vui lòng liên hệ quản trị viên khác.');
      }
      
      const updateData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone
      };
      
      console.log('Update my info thunk - updateData:', updateData); // Debug log
      
      const response = await updateMyInfoAPI(updateData);
      const updatedUser = response.data || response;
      
      console.log('Update my info response:', updatedUser); // Debug log
      
      dispatch(updateMyInfoSuccess(updatedUser));
      
      // Cập nhật lại currentUser trong localStorage
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        try {
          const currentUser = JSON.parse(currentUserData);
          const updatedCurrentUser = {
            ...currentUser,
            fullName: updateData.fullName,
            email: updateData.email,
            phone: updateData.phone
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
          
          // Dispatch để cập nhật currentUser trong Redux state
          dispatch(fetchCurrentUserSuccess(updatedCurrentUser));
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
      }
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Update my info error:', error); // Debug log
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Lỗi khi cập nhật thông tin cá nhân';
      dispatch(updateMyInfoFailure(errorMessage));
      throw error;
    }
  };
};

// Logout thunk
export const logoutUserThunk = () => {
  return (dispatch) => {
    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken'); // Sửa từ 'token' thành 'accessToken'
    
    // Dispatch logout action
    dispatch(logoutUser());
  };
};
