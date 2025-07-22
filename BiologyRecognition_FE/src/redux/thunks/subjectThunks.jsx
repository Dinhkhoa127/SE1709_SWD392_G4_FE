import {
  fetchSubjectsRequest,
  fetchSubjectsSuccess,
  fetchSubjectsFailure,
  fetchSubjectByIdRequest,
  fetchSubjectByIdSuccess,
  fetchSubjectByIdFailure,
  createSubjectRequest,
  createSubjectSuccess,
  createSubjectFailure,
  updateSubjectRequest,
  updateSubjectSuccess,
  updateSubjectFailure,
  deleteSubjectRequest,
  deleteSubjectSuccess,
  deleteSubjectFailure
} from '../actions/subjectActions';

import {
  getSubjectsAPI,
  createSubjectAPI,
  updateSubjectAPI,
  deleteSubjectAPI
} from '../services/apiService';

// Thunk để fetch tất cả subjects
export const fetchSubjects = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchSubjectsRequest());
    try {
      const response = await getSubjectsAPI(params);
      dispatch(fetchSubjectsSuccess(response.data || response));
    } catch (error) {
      // Don't show error message, just clear results
      dispatch(fetchSubjectsFailure(''));
    }
  };
};

// Thunk để fetch subject theo ID
export const fetchSubjectById = (subjectId) => {
  return async (dispatch) => {
    dispatch(fetchSubjectByIdRequest());
    try {
      const response = await getSubjectsAPI({ id: subjectId });
      dispatch(fetchSubjectByIdSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchSubjectByIdFailure(error.response?.data?.message || error.message || 'Failed to fetch subject'));
    }
  };
};

// Thunk để search subjects theo tên với pagination
export const searchSubjectsByName = (params) => {
  return async (dispatch) => {
    dispatch(fetchSubjectsRequest());
    try {
      const response = await getSubjectsAPI(params);
      dispatch(fetchSubjectsSuccess(response.data || response));
    } catch (error) {
      // Don't show error message for search failures, just clear results
      dispatch(fetchSubjectsFailure(''));
    }
  };
};

// Thunk để tạo subject mới
export const createSubject = (subjectData) => {
  return async (dispatch) => {
    dispatch(createSubjectRequest());
    try {
      const response = await createSubjectAPI(subjectData);
      dispatch(createSubjectSuccess(response.data || response));
      // Remove auto refresh - let component handle it
      return Promise.resolve(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create subject';
      dispatch(createSubjectFailure(errorMessage));
      return Promise.reject(error);
    }
  };
};

// Thunk để cập nhật subject
export const updateSubject = ({ subjectId, data }) => {
  return async (dispatch) => {
    dispatch(updateSubjectRequest());
    try {
      const dataToSend = {
        subjectId: Number(subjectId),
        ...data
      };
      
      const response = await updateSubjectAPI(dataToSend);
      dispatch(updateSubjectSuccess(response.data || response));
      // Remove auto refresh - let component handle it
      return Promise.resolve(response);
    } catch (error) {
      dispatch(updateSubjectFailure(error.response?.data?.message || error.message || 'Failed to update subject'));
      return Promise.reject(error);
    }
  };
};

// Thunk để xóa subject
export const deleteSubject = (subjectId) => {
  return async (dispatch) => {
    dispatch(deleteSubjectRequest());
    try {
      await deleteSubjectAPI(subjectId);
      dispatch(deleteSubjectSuccess(subjectId));
      return Promise.resolve(subjectId);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete subject';
      dispatch(deleteSubjectFailure(errorMessage));
      return Promise.reject(error);
    }
  };
};
