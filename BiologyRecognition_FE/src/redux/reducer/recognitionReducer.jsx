import {
  FETCH_RECOGNITIONS_REQUEST,
  FETCH_RECOGNITIONS_SUCCESS,
  FETCH_RECOGNITIONS_FAILURE,
  SEARCH_RECOGNITIONS_REQUEST,
  SEARCH_RECOGNITIONS_SUCCESS,
  SEARCH_RECOGNITIONS_FAILURE,
  CLEAR_RECOGNITION_ERROR
} from '../actions/recognitionActions';

const initialState = {
  recognitions: [],
  loading: false,
  error: null,
  searchResults: []
};

const recognitionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECOGNITIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_RECOGNITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        recognitions: action.payload,
        error: null
      };

    case FETCH_RECOGNITIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SEARCH_RECOGNITIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case SEARCH_RECOGNITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
        error: null
      };

    case SEARCH_RECOGNITIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CLEAR_RECOGNITION_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default recognitionReducer;
