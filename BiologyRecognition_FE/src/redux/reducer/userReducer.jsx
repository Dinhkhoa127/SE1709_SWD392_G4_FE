import {
  FETCH_CURRENT_USER_REQUEST,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_FAILURE
} from '../actions/userActions';

const initialState = {
  currentUser: null,
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
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
    
    default:
      return state;
  }
};

export default userReducer;
