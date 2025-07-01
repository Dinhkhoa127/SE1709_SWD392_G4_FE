import {
  fetchArtifactTypesRequest,
  fetchArtifactTypesSuccess,
  fetchArtifactTypesFailure,
  fetchArtifactTypeByIdRequest,
  fetchArtifactTypeByIdSuccess,
  fetchArtifactTypeByIdFailure,
  createArtifactTypeRequest,
  createArtifactTypeSuccess,
  createArtifactTypeFailure,
  updateArtifactTypeRequest,
  updateArtifactTypeSuccess,
  updateArtifactTypeFailure,
  deleteArtifactTypeRequest,
  deleteArtifactTypeSuccess,
  deleteArtifactTypeFailure
} from '../actions/artifactTypeActions';

import {
  getArtifactTypesAPI,
  getArtifactTypeByIdAPI,
  createArtifactTypeAPI,
  updateArtifactTypeAPI,
  deleteArtifactTypeAPI
} from '../services/apiService';

// Thunk để fetch tất cả artifact types
export const fetchArtifactTypes = () => {
  return async (dispatch) => {
    dispatch(fetchArtifactTypesRequest());
    try {
      const response = await getArtifactTypesAPI();
      dispatch(fetchArtifactTypesSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchArtifactTypesFailure(error.response?.data?.message || error.message || 'Failed to fetch artifact types'));
    }
  };
};

// Thunk để fetch artifact type theo ID
export const fetchArtifactTypeById = (artifactTypeId) => {
  return async (dispatch) => {
    dispatch(fetchArtifactTypeByIdRequest());
    try {
      const response = await getArtifactTypeByIdAPI(artifactTypeId);
      dispatch(fetchArtifactTypeByIdSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchArtifactTypeByIdFailure(error.response?.data?.message || error.message || 'Failed to fetch artifact type'));
    }
  };
};

// Thunk để tạo artifact type mới
export const createArtifactType = (artifactTypeData) => {
  return async (dispatch) => {
    dispatch(createArtifactTypeRequest());
    try {
      const response = await createArtifactTypeAPI(artifactTypeData);
      dispatch(createArtifactTypeSuccess(response.data || response));
      dispatch(fetchArtifactTypes()); // Refresh the list
      return Promise.resolve();
    } catch (error) {
      dispatch(createArtifactTypeFailure(error.response?.data?.message || error.message || 'Failed to create artifact type'));
      return Promise.reject(error);
    }
  };
};

// Thunk để cập nhật artifact type
export const updateArtifactType = (artifactTypeData) => {
  return async (dispatch) => {
    dispatch(updateArtifactTypeRequest());
    try {
      const response = await updateArtifactTypeAPI(artifactTypeData);
      dispatch(updateArtifactTypeSuccess(response.data || response));
      dispatch(fetchArtifactTypes()); // Refresh the list
      return Promise.resolve();
    } catch (error) {
      dispatch(updateArtifactTypeFailure(error.response?.data?.message || error.message || 'Failed to update artifact type'));
      return Promise.reject(error);
    }
  };
};

// Thunk để xóa artifact type
export const deleteArtifactType = (artifactTypeId) => {
  return async (dispatch) => {
    dispatch(deleteArtifactTypeRequest());
    try {
      await deleteArtifactTypeAPI(artifactTypeId);
      dispatch(deleteArtifactTypeSuccess(artifactTypeId));
      return Promise.resolve();
    } catch (error) {
      dispatch(deleteArtifactTypeFailure(error.response?.data?.message || error.message || 'Failed to delete artifact type'));
      return Promise.reject(error);
    }
  };
};