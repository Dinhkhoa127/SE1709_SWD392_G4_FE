import {
  FETCH_SUBJECTS_REQUEST,
  FETCH_SUBJECTS_SUCCESS,
  FETCH_SUBJECTS_FAILURE,
  FETCH_SUBJECT_BY_ID_REQUEST,
  FETCH_SUBJECT_BY_ID_SUCCESS,
  FETCH_SUBJECT_BY_ID_FAILURE,
  CREATE_SUBJECT_REQUEST,
  CREATE_SUBJECT_SUCCESS,
  CREATE_SUBJECT_FAILURE,
  UPDATE_SUBJECT_REQUEST,
  UPDATE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_FAILURE,
  DELETE_SUBJECT_REQUEST,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILURE
} from '../actions/subjectActions';

const initialState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchSubjectLoading: false
};

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_SUBJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        subjects: action.payload,
        error: null
      };
    
    case FETCH_SUBJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case FETCH_SUBJECT_BY_ID_REQUEST:
      return {
        ...state,
        fetchSubjectLoading: true,
        error: null
      };
    
    case FETCH_SUBJECT_BY_ID_SUCCESS:
      return {
        ...state,
        fetchSubjectLoading: false,
        selectedSubject: action.payload,
        error: null
      };
    
    case FETCH_SUBJECT_BY_ID_FAILURE:
      return {
        ...state,
        fetchSubjectLoading: false,
        error: action.payload
      };
    
    case CREATE_SUBJECT_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null
      };
    
    case CREATE_SUBJECT_SUCCESS:
      return {
        ...state,
        createLoading: false,
        subjects: [...state.subjects, action.payload],
        error: null
      };
    
    case CREATE_SUBJECT_FAILURE:
      return {
        ...state,
        createLoading: false,
        error: action.payload
      };
    
    case UPDATE_SUBJECT_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null
      };
    
    case UPDATE_SUBJECT_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        subjects: state.subjects.map(subject => 
          subject.subject_id === action.payload.subject_id ? action.payload : subject
        ),
        error: null
      };
    
    case UPDATE_SUBJECT_FAILURE:
      return {
        ...state,
        updateLoading: false,
        error: action.payload
      };
    
    case DELETE_SUBJECT_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null
      };
    
    case DELETE_SUBJECT_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        subjects: state.subjects.filter(subject => subject.subject_id !== action.payload),
        error: null
      };
    
    case DELETE_SUBJECT_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default subjectReducer;
