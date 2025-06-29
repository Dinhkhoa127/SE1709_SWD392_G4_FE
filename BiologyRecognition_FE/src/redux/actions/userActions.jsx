// Action types
export const FETCH_CURRENT_USER_REQUEST = 'FETCH_CURRENT_USER_REQUEST';
export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_FAILURE = 'FETCH_CURRENT_USER_FAILURE';

// Action creators
export const fetchCurrentUserRequest = () => ({
  type: FETCH_CURRENT_USER_REQUEST
});

export const fetchCurrentUserSuccess = (user) => ({
  type: FETCH_CURRENT_USER_SUCCESS,
  payload: user
});

export const fetchCurrentUserFailure = (error) => ({
  type: FETCH_CURRENT_USER_FAILURE,
  payload: error
});
