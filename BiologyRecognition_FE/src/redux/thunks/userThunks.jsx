import {
  fetchCurrentUserRequest,
  fetchCurrentUserSuccess,
  fetchCurrentUserFailure
} from '../actions/userActions';

import { getCurrentUserAPI } from '../services/apiService';

// Thunk để fetch current user
export const fetchCurrentUser = () => {
  return async (dispatch) => {
    dispatch(fetchCurrentUserRequest());
    try {
      const response = await getCurrentUserAPI();
      dispatch(fetchCurrentUserSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchCurrentUserFailure(error.response?.data?.message || error.message || 'Failed to fetch current user'));
    }
  };
};
