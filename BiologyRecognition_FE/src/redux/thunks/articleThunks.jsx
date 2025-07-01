import {
  fetchArticlesRequest,
  fetchArticlesSuccess,
  fetchArticlesFailure,
  fetchArticleByIdRequest,
  fetchArticleByIdSuccess,
  fetchArticleByIdFailure,
  createArticleRequest,
  createArticleSuccess,
  createArticleFailure,
  updateArticleRequest,
  updateArticleSuccess,
  updateArticleFailure,
  deleteArticleRequest,
  deleteArticleSuccess,
  deleteArticleFailure,
  setSelectedArticle
} from '../actions/articleActions';

import {
  getArticlesAPI,
  getArticleByIdAPI,
  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI
} from '../services/apiService';

// Fetch all articles
export const fetchArticlesThunk = () => {
  return async (dispatch) => {
    dispatch(fetchArticlesRequest());
    
    try {
      const response = await getArticlesAPI();
      
      // API trả về array trực tiếp hoặc trong response.data
      const articles = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      
      dispatch(fetchArticlesSuccess(articles));
      return articles;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách bài viết';
      dispatch(fetchArticlesFailure(errorMessage));
      throw error;
    }
  };
};

// Fetch article by ID
export const fetchArticleByIdThunk = (articleId) => {
  return async (dispatch) => {
    dispatch(fetchArticleByIdRequest());
    
    try {
      const response = await getArticleByIdAPI(articleId);
      dispatch(fetchArticleByIdSuccess(response.data));
      dispatch(setSelectedArticle(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải thông tin bài viết';
      dispatch(fetchArticleByIdFailure(errorMessage));
      throw error;
    }
  };
};

// Create new article
export const createArticleThunk = (articleData) => {
  return async (dispatch) => {
    dispatch(createArticleRequest());
    
    try {
      const response = await createArticleAPI(articleData);
      
      // Dispatch success with the new article data for immediate UI update
      dispatch(createArticleSuccess(response.data));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tạo bài viết';
      dispatch(createArticleFailure(errorMessage));
      throw error;
    }
  };
};

// Update article
export const updateArticleThunk = ({ articleId, data }) => {
  return async (dispatch) => {
    dispatch(updateArticleRequest());
    
    try {
      // Prepare the update data with ID
      const updateData = {
        ...data,
        articleId: articleId
      };
      
      const response = await updateArticleAPI(updateData);
      
      // Kiểm tra xem response.data có tồn tại không
      const updatedArticle = response.data || response;
      
      dispatch(updateArticleSuccess(updatedArticle));
      
      // Refresh articles list after update
      dispatch(fetchArticlesThunk());
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi cập nhật bài viết';
      dispatch(updateArticleFailure(errorMessage));
      throw error;
    }
  };
};

// Delete article
export const deleteArticleThunk = (articleId) => {
  return async (dispatch) => {
    dispatch(deleteArticleRequest());
    
    try {
      await deleteArticleAPI(articleId);
      dispatch(deleteArticleSuccess(articleId));
      
      // Refresh articles list after delete
      dispatch(fetchArticlesThunk());
      
      return articleId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa bài viết';
      dispatch(deleteArticleFailure(errorMessage));
      throw error;
    }
  };
};
