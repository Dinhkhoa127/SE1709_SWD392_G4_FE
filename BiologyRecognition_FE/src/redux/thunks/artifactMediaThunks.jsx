import {
  fetchArtifactMediaRequest,
  fetchArtifactMediaSuccess,
  fetchArtifactMediaFailure,
  fetchArtifactMediaByIdRequest,
  fetchArtifactMediaByIdSuccess,
  fetchArtifactMediaByIdFailure,
  createArtifactMediaRequest,
  createArtifactMediaSuccess,
  createArtifactMediaFailure,
  updateArtifactMediaRequest,
  updateArtifactMediaSuccess,
  updateArtifactMediaFailure,
  deleteArtifactMediaRequest,
  deleteArtifactMediaSuccess,
  deleteArtifactMediaFailure
} from '../actions/artifactMediaActions';

import {
  getArtifactMediaAPI,

  createArtifactMediaAPI,
  updateArtifactMediaAPI,
  deleteArtifactMediaAPI
} from '../services/apiService';

// Thunk để fetch tất cả artifact media với parameters
export const fetchArtifactMedia = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchArtifactMediaRequest());
    try {
      const response = await getArtifactMediaAPI(params);
      dispatch(fetchArtifactMediaSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchArtifactMediaFailure(''));
    }
  };
};

// Thunk để search artifact media với parameters
export const searchArtifactMedia = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchArtifactMediaRequest());
    try {
      const response = await getArtifactMediaAPI(params);
      dispatch(fetchArtifactMediaSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchArtifactMediaFailure(''));
    }
  };
};

// Thunk để fetch artifact media theo ID
export const fetchArtifactMediaById = (artifactMediaId) => {
  return async (dispatch) => {
    dispatch(fetchArtifactMediaByIdRequest());
    try {
      const response = await getArtifactMediaAPI({ artifactMediaId });
      const mediaData = Array.isArray(response.data) ? response.data[0] : response.data || response;
      dispatch(fetchArtifactMediaByIdSuccess(mediaData));
    } catch (error) {
      dispatch(fetchArtifactMediaByIdFailure(''));
    }
  };
};

// Thunk để tạo artifact media mới
export const createArtifactMedia = (artifactMediaData) => {
  return async (dispatch) => {
    dispatch(createArtifactMediaRequest());
    try {
      const response = await createArtifactMediaAPI(artifactMediaData);
      dispatch(createArtifactMediaSuccess(response.data || response));
      dispatch(fetchArtifactMedia()); // Refresh the list
      return Promise.resolve();
    } catch (error) {
      dispatch(createArtifactMediaFailure(''));
      return Promise.reject(error);
    }
  };
};

// Thunk để cập nhật artifact media
export const updateArtifactMedia = (artifactMediaData) => {
  return async (dispatch) => {
    dispatch(updateArtifactMediaRequest());
    try {
      const response = await updateArtifactMediaAPI(artifactMediaData);
      dispatch(updateArtifactMediaSuccess(response.data || response));
      dispatch(fetchArtifactMedia()); // Refresh the list
      return Promise.resolve();
    } catch (error) {
      dispatch(updateArtifactMediaFailure(''));
      return Promise.reject(error);
    }
  };
};

// Thunk để xóa artifact media
export const deleteArtifactMedia = (artifactMediaId) => {
  return async (dispatch) => {
    dispatch(deleteArtifactMediaRequest());
    try {
      await deleteArtifactMediaAPI(artifactMediaId);
      dispatch(deleteArtifactMediaSuccess(artifactMediaId));
      return Promise.resolve();
    } catch (error) {
      dispatch(deleteArtifactMediaFailure(''));
      return Promise.reject(error);
    }
  };
};