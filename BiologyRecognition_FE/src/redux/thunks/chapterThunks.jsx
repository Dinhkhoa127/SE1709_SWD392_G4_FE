import {
  fetchChaptersRequest,
  fetchChaptersSuccess,
  fetchChaptersFailure,
  createChapterRequest,
  createChapterSuccess,
  createChapterFailure,
  updateChapterRequest,
  updateChapterSuccess,
  updateChapterFailure,
  fetchChapterByIdRequest,
  fetchChapterByIdSuccess,
  fetchChapterByIdFailure,
  deleteChapterRequest,
  deleteChapterSuccess,
  deleteChapterFailure
} from '../actions/chapterActions';

import {
  getChaptersAPI,
  createChapterAPI,
  updateChapterAPI,
  getChapterByIdAPI,
  deleteChapterAPI
} from '../services/apiService';

// Thunk để fetch tất cả chapters
export const fetchChapters = () => {
  return async (dispatch) => {
    dispatch(fetchChaptersRequest());
    try {
      const response = await getChaptersAPI();
      dispatch(fetchChaptersSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchChaptersFailure(error.response?.data?.message || error.message || 'Failed to fetch chapters'));
    }
  };
};

// Thunk để tạo chapter mới
export const createChapter = (chapterData) => {
  return async (dispatch) => {
    dispatch(createChapterRequest());
    try {
      const response = await createChapterAPI(chapterData);
      dispatch(createChapterSuccess(response.data || response));
      dispatch(fetchChapters());
      return Promise.resolve(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create chapter';
      dispatch(createChapterFailure(errorMessage));
      return Promise.reject(error);
    }
  };
};

// Thunk để cập nhật chapter
export const updateChapter = ({ chapterId, data }) => {
  return async (dispatch) => {
    dispatch(updateChapterRequest());
    try {
      const dataToSend = {
        chapterId: Number(chapterId),
        ...data
      };
      const response = await updateChapterAPI(dataToSend);
      dispatch(updateChapterSuccess(response.data || response));
      dispatch(fetchChapters());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(updateChapterFailure(error.response?.data?.message || error.message || 'Failed to update chapter'));
      return Promise.reject(error);
    }
  };
}; 

// Thunk để fetch chapter theo ID
export const fetchChapterById = (chapterId) => {
  return async (dispatch) => {
    dispatch(fetchChapterByIdRequest());
    try {
      const response = await getChapterByIdAPI(chapterId);
      dispatch(fetchChapterByIdSuccess(response.data || response));
    } catch (error) {
      dispatch(fetchChapterByIdFailure(error.response?.data?.message || error.message || 'Failed to fetch chapter'));
    }
  };
};
export const deleteChapter = (chapterId) => {
  return async (dispatch) => {
    dispatch(deleteChapterRequest());
    try {
      const response = await deleteChapterAPI(chapterId);
      dispatch(deleteChapterSuccess(chapterId));
      dispatch(fetchChapters());
      return Promise.resolve(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete chapter';
      dispatch(deleteChapterFailure(errorMessage));
      return Promise.reject(error);
    }
  };
}