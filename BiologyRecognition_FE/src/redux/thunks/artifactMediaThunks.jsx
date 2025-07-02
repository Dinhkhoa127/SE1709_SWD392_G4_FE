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
  getArtifactMediaByIdAPI,
  createArtifactMediaAPI,
  updateArtifactMediaAPI,
  deleteArtifactMediaAPI
} from '../services/apiService';

// Thunk để fetch tất cả artifact media
export const fetchArtifactMedia = () => {
  return async (dispatch) => {
    dispatch(fetchArtifactMediaRequest());
    try {
      const response = await getArtifactMediaAPI();
      dispatch(fetchArtifactMediaSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchArtifactMediaFailure(error.response?.data?.message || error.message || 'Failed to fetch artifact media'));
    }
  };
};

// Thunk để fetch artifact media theo ID
export const fetchArtifactMediaById = (artifactMediaId) => {
  return async (dispatch) => {
    dispatch(fetchArtifactMediaByIdRequest());
    try {
      const response = await getArtifactMediaByIdAPI(artifactMediaId);
      dispatch(fetchArtifactMediaByIdSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchArtifactMediaByIdFailure(error.response?.data?.message || error.message || 'Failed to fetch artifact media'));
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
      dispatch(createArtifactMediaFailure(error.response?.data?.message || error.message || 'Failed to create artifact media'));
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
      dispatch(updateArtifactMediaFailure(error.response?.data?.message || error.message || 'Failed to update artifact media'));
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
      dispatch(deleteArtifactMediaFailure(error.response?.data?.message || error.message || 'Failed to delete artifact media'));
      return Promise.reject(error);
    }
  };
};