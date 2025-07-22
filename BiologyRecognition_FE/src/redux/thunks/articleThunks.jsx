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

  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI
} from '../services/apiService';

// Fetch all articles with parameters
export const fetchArticlesThunk = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchArticlesRequest());
    
    try {
      console.log('fetchArticlesThunk - params:', params);
      let response;
      if (params.artifactName) {
        // Use get API with artifactName parameter
        response = await getArticlesAPI(params);
      } else {
        // Use regular API with pagination parameters
        response = await getArticlesAPI(params);
      }
      
      console.log('fetchArticlesThunk - API response:', response);
      
      // API trả về array trực tiếp hoặc trong response.data
      const articles = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      
      console.log('fetchArticlesThunk - processed articles:', articles);
      
      // Debug each article's structure
      articles.forEach((article, index) => {
        console.log(`Regular Article ${index}:`, {
          id: article.articleId || article.article_id,
          title: article.title,
          artifactIds: article.artifactIds,
          artifacts: article.artifacts,
          allFields: Object.keys(article)
        });
      });
      
      dispatch(fetchArticlesSuccess(articles));
      return articles;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách bài viết';
      dispatch(fetchArticlesFailure(''));
      throw error;
    }
  };
};

// Search articles with pagination
export const searchArticles = (params) => {
  return async (dispatch) => {
    dispatch(fetchArticlesRequest());
    
    try {
      console.log('searchArticles - params:', params);
      const response = await getArticlesAPI(params);
      console.log('searchArticles - API response:', response);
      
      const articles = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      console.log('searchArticles - processed articles:', articles);
      
      // Debug each article's structure
      articles.forEach((article, index) => {
        console.log(`Article ${index}:`, {
          id: article.articleId || article.article_id,
          title: article.title,
          artifactIds: article.artifactIds,
          artifacts: article.artifacts,
          allFields: Object.keys(article)
        });
      });
      
      dispatch(fetchArticlesSuccess(articles));
      return articles;
    } catch (error) {
      dispatch(fetchArticlesFailure(''));
      throw error;
    }
  };
};

// Fetch article by ID
export const fetchArticleByIdThunk = (articleId) => {
  return async (dispatch) => {
    dispatch(fetchArticleByIdRequest());
    try {
      const response = await getArticlesAPI({ articleId });
      const articleData = Array.isArray(response.data) ? response.data[0] : response.data || response;
      dispatch(fetchArticleByIdSuccess(articleData));
      dispatch(setSelectedArticle(articleData));
      return articleData;
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
