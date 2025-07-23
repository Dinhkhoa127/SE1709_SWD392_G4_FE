import {
  fetchTopicsRequest,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  fetchTopicByIdRequest,
  fetchTopicByIdSuccess,
  fetchTopicByIdFailure,
  createTopicRequest,
  createTopicSuccess,
  createTopicFailure,
  updateTopicRequest,
  updateTopicSuccess,
  updateTopicFailure,
  deleteTopicRequest,
  deleteTopicSuccess,
  deleteTopicFailure
} from '../actions/topicActions';

import {
  getTopicsAPI,

  createTopicAPI,
  updateTopicAPI,
  deleteTopicAPI
} from '../services/apiService';

// Thunk để fetch tất cả topics
export const fetchTopics = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchTopicsRequest());
    try {
      const response = await getTopicsAPI(params);
      dispatch(fetchTopicsSuccess(response.data || response));
    } catch (error) {
      // Don't show error message, just clear results
      dispatch(fetchTopicsFailure(''));
    }
  };
};

// Thunk để search topics theo tên với pagination
export const searchTopicsByName = (params) => {
  return async (dispatch) => {
    dispatch(fetchTopicsRequest());
    try {
      const response = await getTopicsAPI(params);
      dispatch(fetchTopicsSuccess(response.data || response));
    } catch (error) {
      // Don't show error message for search failures, just clear results
      dispatch(fetchTopicsFailure(''));
    }
  };
};

// Thunk để fetch topic theo ID
export const fetchTopicById = (topicId) => {
  return async (dispatch) => {
    dispatch(fetchTopicByIdRequest());
    try {
      const response = await getTopicsAPI({ id: topicId });
      const topicData = Array.isArray(response.data) ? response.data[0] : response.data || response;
      dispatch(fetchTopicByIdSuccess(topicData));
      return Promise.resolve(topicData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch topic';
      dispatch(fetchTopicByIdFailure(errorMessage));
      return Promise.reject(error);
    }
  };
};

// Thunk để tạo topic mới
export const createTopic = (topicData) => {
  return async (dispatch) => {
    dispatch(createTopicRequest());
    try {
      const response = await createTopicAPI(topicData);
      dispatch(createTopicSuccess(response.data || response));
      dispatch(fetchTopics());
      return Promise.resolve(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create topic';
      dispatch(createTopicFailure(errorMessage));
      return Promise.reject(error);
    }
  };
};

// Thunk để cập nhật topic
export const updateTopic = ({ topicId, data }) => {
  return async (dispatch) => {
    dispatch(updateTopicRequest());
    try {
      const dataToSend = {
        topicId: Number(topicId),
        ...data
      };
      
      const response = await updateTopicAPI(dataToSend);
      dispatch(updateTopicSuccess(response.data || response));
      dispatch(fetchTopics());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(updateTopicFailure(error.response?.data?.message || error.message || 'Failed to update topic'));
      return Promise.reject(error);
    }
  };
};

// Thunk để xóa topic
export const deleteTopic = (topicId) => {
  return async (dispatch) => {
    dispatch(deleteTopicRequest());
    try {
      await deleteTopicAPI(topicId);
      dispatch(deleteTopicSuccess(topicId));
      return Promise.resolve(topicId);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete topic';
      dispatch(deleteTopicFailure(errorMessage));
      return Promise.reject(error);
    }
  };
};
