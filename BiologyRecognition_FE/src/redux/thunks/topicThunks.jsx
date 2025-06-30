import {
  fetchTopicsRequest,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  fetchTopicByIdRequest,
  fetchTopicByIdSuccess,
  fetchTopicByIdFailure
} from '../actions/topicActions';

import {
  getTopicsAPI,
  getTopicByIdAPI
} from '../services/apiService';

// Thunk để fetch tất cả topics
export const fetchTopics = () => {
  return async (dispatch) => {
    dispatch(fetchTopicsRequest());
    try {
      const response = await getTopicsAPI();
      dispatch(fetchTopicsSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchTopicsFailure(error.response?.data?.message || error.message || 'Failed to fetch topics'));
    }
  };
};

// Thunk để fetch topic theo ID
export const fetchTopicById = (topicId) => {
  return async (dispatch) => {
    dispatch(fetchTopicByIdRequest());
    try {
      const response = await getTopicByIdAPI(topicId);
      dispatch(fetchTopicByIdSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchTopicByIdFailure(error.response?.data?.message || error.message || 'Failed to fetch topic'));
    }
  };
};
