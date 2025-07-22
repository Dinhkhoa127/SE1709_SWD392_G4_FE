import {
  FETCH_TOPICS_REQUEST,
  FETCH_TOPICS_SUCCESS,
  FETCH_TOPICS_FAILURE,
  FETCH_TOPIC_BY_ID_REQUEST,
  FETCH_TOPIC_BY_ID_SUCCESS,
  FETCH_TOPIC_BY_ID_FAILURE,
  CREATE_TOPIC_REQUEST,
  CREATE_TOPIC_SUCCESS,
  CREATE_TOPIC_FAILURE,
  UPDATE_TOPIC_REQUEST,
  UPDATE_TOPIC_SUCCESS,
  UPDATE_TOPIC_FAILURE,
  DELETE_TOPIC_REQUEST,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_FAILURE
} from '../actions/topicActions';

const initialState = {
  topics: [],
  selectedTopic: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchTopicLoading: false
};

const topicReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TOPICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_TOPICS_SUCCESS:
      return {
        ...state,
        loading: false,
        topics: action.payload,
        error: null
      };
    
    case FETCH_TOPICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        topics: [] // Clear topics when search fails
      };
    
    case FETCH_TOPIC_BY_ID_REQUEST:
      return {
        ...state,
        fetchTopicLoading: true,
        error: null
      };
    
    case FETCH_TOPIC_BY_ID_SUCCESS:
      return {
        ...state,
        fetchTopicLoading: false,
        selectedTopic: action.payload,
        error: null
      };
    
    case FETCH_TOPIC_BY_ID_FAILURE:
      return {
        ...state,
        fetchTopicLoading: false,
        error: action.payload
      };
    
    case CREATE_TOPIC_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null
      };
    
    case CREATE_TOPIC_SUCCESS:
      return {
        ...state,
        createLoading: false,
        topics: [...state.topics, action.payload],
        error: null
      };
    
    case CREATE_TOPIC_FAILURE:
      return {
        ...state,
        createLoading: false,
        error: action.payload
      };
    
    case UPDATE_TOPIC_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null
      };
    
    case UPDATE_TOPIC_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        topics: state.topics.map(topic => 
          topic.topic_id === action.payload.topic_id ? action.payload : topic
        ),
        error: null
      };
    
    case UPDATE_TOPIC_FAILURE:
      return {
        ...state,
        updateLoading: false,
        error: action.payload
      };
    
    case DELETE_TOPIC_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null
      };
    
    case DELETE_TOPIC_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        topics: state.topics.filter(topic => topic.topic_id !== action.payload),
        error: null
      };
    
    case DELETE_TOPIC_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default topicReducer;
