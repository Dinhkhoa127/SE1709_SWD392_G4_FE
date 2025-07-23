// Action types
export const FETCH_CURRENT_USER_REQUEST = 'FETCH_CURRENT_USER_REQUEST';
export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_FAILURE = 'FETCH_CURRENT_USER_FAILURE';
export const LOGOUT_USER = 'LOGOUT_USER';

// Users Management Action Types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_USER_BY_ID_REQUEST = 'FETCH_USER_BY_ID_REQUEST';
export const FETCH_USER_BY_ID_SUCCESS = 'FETCH_USER_BY_ID_SUCCESS';
export const FETCH_USER_BY_ID_FAILURE = 'FETCH_USER_BY_ID_FAILURE';

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const SET_SELECTED_USER = 'SET_SELECTED_USER';
export const CLEAR_USER_ERROR = 'CLEAR_USER_ERROR';

// Update My Info Action Types
export const UPDATE_MY_INFO_REQUEST = 'UPDATE_MY_INFO_REQUEST';
export const UPDATE_MY_INFO_SUCCESS = 'UPDATE_MY_INFO_SUCCESS';
export const UPDATE_MY_INFO_FAILURE = 'UPDATE_MY_INFO_FAILURE';

// Current User Action creators
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

// Logout User Action
export const logoutUser = () => ({
  type: LOGOUT_USER
});

// Users Management Action Creators
// Fetch Users Actions
export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error
});

// Fetch User by ID Actions
export const fetchUserByIdRequest = () => ({
  type: FETCH_USER_BY_ID_REQUEST
});

export const fetchUserByIdSuccess = (user) => ({
  type: FETCH_USER_BY_ID_SUCCESS,
  payload: user
});

export const fetchUserByIdFailure = (error) => ({
  type: FETCH_USER_BY_ID_FAILURE,
  payload: error
});

// Create User Actions
export const createUserRequest = () => ({
  type: CREATE_USER_REQUEST
});

export const createUserSuccess = (user) => ({
  type: CREATE_USER_SUCCESS,
  payload: user
});

export const createUserFailure = (error) => ({
  type: CREATE_USER_FAILURE,
  payload: error
});

// Update User Actions
export const updateUserRequest = () => ({
  type: UPDATE_USER_REQUEST
});

export const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error
});

// Delete User Actions
export const deleteUserRequest = () => ({
  type: DELETE_USER_REQUEST
});

export const deleteUserSuccess = (userId) => ({
  type: DELETE_USER_SUCCESS,
  payload: userId
});

export const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  payload: error
});

// Utility Actions
export const setSelectedUser = (user) => ({
  type: SET_SELECTED_USER,
  payload: user
});

export const clearUserError = () => ({
  type: CLEAR_USER_ERROR
});

// Update My Info Action Creators
export const updateMyInfoRequest = () => ({
  type: UPDATE_MY_INFO_REQUEST
});

export const updateMyInfoSuccess = (user) => ({
  type: UPDATE_MY_INFO_SUCCESS,
  payload: user
});

export const updateMyInfoFailure = (error) => ({
  type: UPDATE_MY_INFO_FAILURE,
  payload: error
});
