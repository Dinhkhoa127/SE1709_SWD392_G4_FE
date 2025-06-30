// Topic Actions

// Fetch all topics
export const FETCH_TOPICS_REQUEST = 'FETCH_TOPICS_REQUEST';
export const FETCH_TOPICS_SUCCESS = 'FETCH_TOPICS_SUCCESS';
export const FETCH_TOPICS_FAILURE = 'FETCH_TOPICS_FAILURE';

export const fetchTopicsRequest = () => ({
  type: FETCH_TOPICS_REQUEST
});

export const fetchTopicsSuccess = (topics) => ({
  type: FETCH_TOPICS_SUCCESS,
  payload: topics
});

export const fetchTopicsFailure = (error) => ({
  type: FETCH_TOPICS_FAILURE,
  payload: error
});

// Fetch topic by ID
export const FETCH_TOPIC_BY_ID_REQUEST = 'FETCH_TOPIC_BY_ID_REQUEST';
export const FETCH_TOPIC_BY_ID_SUCCESS = 'FETCH_TOPIC_BY_ID_SUCCESS';
export const FETCH_TOPIC_BY_ID_FAILURE = 'FETCH_TOPIC_BY_ID_FAILURE';

export const fetchTopicByIdRequest = () => ({
  type: FETCH_TOPIC_BY_ID_REQUEST
});

export const fetchTopicByIdSuccess = (topic) => ({
  type: FETCH_TOPIC_BY_ID_SUCCESS,
  payload: topic
});

export const fetchTopicByIdFailure = (error) => ({
  type: FETCH_TOPIC_BY_ID_FAILURE,
  payload: error
});
