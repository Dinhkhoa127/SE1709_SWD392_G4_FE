import {
  FETCH_CURRENT_USER_REQUEST,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_FAILURE,
  LOGOUT_USER,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_BY_ID_REQUEST,
  FETCH_USER_BY_ID_SUCCESS,
  FETCH_USER_BY_ID_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  SET_SELECTED_USER,
  CLEAR_USER_ERROR
} from '../actions/userActions';

const initialState = {
  // Current User (for authentication)
  currentUser: null,
  loading: false,
  error: null,
  
  // Users Management
  users: [],
  selectedUser: null,
  loadingUsers: false,
  creating: false,
  updating: false,
  deleting: false,
  usersError: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Current User Cases
    case FETCH_CURRENT_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_CURRENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        error: null
      };
    
    case FETCH_CURRENT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case LOGOUT_USER:
      return {
        ...state,
        currentUser: null,
        loading: false,
        error: null
      };

    // Fetch Users Cases
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loadingUsers: true,
        usersError: null
      };
      
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loadingUsers: false,
        users: action.payload,
        usersError: null
      };
      
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loadingUsers: false,
        usersError: action.payload
      };

    // Fetch User by ID Cases
    case FETCH_USER_BY_ID_REQUEST:
      return {
        ...state,
        loadingUsers: true,
        usersError: null
      };
      
    case FETCH_USER_BY_ID_SUCCESS:
      return {
        ...state,
        loadingUsers: false,
        selectedUser: action.payload,
        usersError: null
      };
      
    case FETCH_USER_BY_ID_FAILURE:
      return {
        ...state,
        loadingUsers: false,
        usersError: action.payload
      };

    // Create User Cases
    case CREATE_USER_REQUEST:
      return {
        ...state,
        creating: true,
        usersError: null
      };
      
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        creating: false,
        users: [action.payload, ...state.users],
        usersError: null
      };
      
    case CREATE_USER_FAILURE:
      return {
        ...state,
        creating: false,
        usersError: action.payload
      };

    // Update User Cases
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        updating: true,
        usersError: null
      };
      
    case UPDATE_USER_SUCCESS:
      const updatedId = action.payload.userAccountId || action.payload.id;
      return {
        ...state,
        updating: false,
        users: state.users.map(user => {
          const currentId = user.userAccountId || user.id;
          return currentId === updatedId ? { ...user, ...action.payload } : user;
        }),
        selectedUser: action.payload,
        usersError: null
      };
      
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        updating: false,
        usersError: action.payload
      };

    // Delete User Cases
    case DELETE_USER_REQUEST:
      return {
        ...state,
        deleting: true,
        usersError: null
      };
      
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        deleting: false,
        users: state.users.filter(user => {
          const userId = user.userAccountId || user.id;
          return userId !== action.payload;
        }),
        usersError: null
      };
      
    case DELETE_USER_FAILURE:
      return {
        ...state,
        deleting: false,
        usersError: action.payload
      };

    // Utility Cases
    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload
      };
      
    case CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
        usersError: null
      };
    
    default:
      return state;
  }
};

export default userReducer;
