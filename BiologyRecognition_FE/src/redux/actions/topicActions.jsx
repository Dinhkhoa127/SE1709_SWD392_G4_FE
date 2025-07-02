// Topic action constants
export const FETCH_TOPICS_REQUEST = 'FETCH_TOPICS_REQUEST';
export const FETCH_TOPICS_SUCCESS = 'FETCH_TOPICS_SUCCESS';
export const FETCH_TOPICS_FAILURE = 'FETCH_TOPICS_FAILURE';

export const FETCH_TOPIC_BY_ID_REQUEST = 'FETCH_TOPIC_BY_ID_REQUEST';
export const FETCH_TOPIC_BY_ID_SUCCESS = 'FETCH_TOPIC_BY_ID_SUCCESS';
export const FETCH_TOPIC_BY_ID_FAILURE = 'FETCH_TOPIC_BY_ID_FAILURE';

export const CREATE_TOPIC_REQUEST = 'CREATE_TOPIC_REQUEST';
export const CREATE_TOPIC_SUCCESS = 'CREATE_TOPIC_SUCCESS';
export const CREATE_TOPIC_FAILURE = 'CREATE_TOPIC_FAILURE';

export const UPDATE_TOPIC_REQUEST = 'UPDATE_TOPIC_REQUEST';
export const UPDATE_TOPIC_SUCCESS = 'UPDATE_TOPIC_SUCCESS';
export const UPDATE_TOPIC_FAILURE = 'UPDATE_TOPIC_FAILURE';

export const DELETE_TOPIC_REQUEST = 'DELETE_TOPIC_REQUEST';
export const DELETE_TOPIC_SUCCESS = 'DELETE_TOPIC_SUCCESS';
export const DELETE_TOPIC_FAILURE = 'DELETE_TOPIC_FAILURE';

// Topic action creators
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

export const createTopicRequest = () => ({
  type: CREATE_TOPIC_REQUEST
});

export const createTopicSuccess = (topic) => ({
  type: CREATE_TOPIC_SUCCESS,
  payload: topic
});

export const createTopicFailure = (error) => ({
  type: CREATE_TOPIC_FAILURE,
  payload: error
});

export const updateTopicRequest = () => ({
  type: UPDATE_TOPIC_REQUEST
});

export const updateTopicSuccess = (topic) => ({
  type: UPDATE_TOPIC_SUCCESS,
  payload: topic
});

export const updateTopicFailure = (error) => ({
  type: UPDATE_TOPIC_FAILURE,
  payload: error
});

export const deleteTopicRequest = () => ({
  type: DELETE_TOPIC_REQUEST
});

export const deleteTopicSuccess = (topicId) => ({
  type: DELETE_TOPIC_SUCCESS,
  payload: topicId
});

export const deleteTopicFailure = (error) => ({
  type: DELETE_TOPIC_FAILURE,
  payload: error
});
