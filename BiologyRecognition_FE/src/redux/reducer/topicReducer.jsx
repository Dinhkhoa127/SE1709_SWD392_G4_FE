import {
  FETCH_TOPICS_REQUEST,
  FETCH_TOPICS_SUCCESS,
  FETCH_TOPICS_FAILURE,
  FETCH_TOPIC_BY_ID_REQUEST,
  FETCH_TOPIC_BY_ID_SUCCESS,
  FETCH_TOPIC_BY_ID_FAILURE
} from '../actions/topicActions';

const initialState = {
  topics: [],
  selectedTopic: null,
  loading: false,
  fetchTopicLoading: false,
  error: null
};

const topicReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all topics
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
        error: action.payload
      };

    // Fetch topic by ID
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

    default:
      return state;
  }
};

export default topicReducer;
