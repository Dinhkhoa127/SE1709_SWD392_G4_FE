// Article Actions
export const FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST';
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS';
export const FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE';

export const FETCH_ARTICLE_BY_ID_REQUEST = 'FETCH_ARTICLE_BY_ID_REQUEST';
export const FETCH_ARTICLE_BY_ID_SUCCESS = 'FETCH_ARTICLE_BY_ID_SUCCESS';
export const FETCH_ARTICLE_BY_ID_FAILURE = 'FETCH_ARTICLE_BY_ID_FAILURE';

export const CREATE_ARTICLE_REQUEST = 'CREATE_ARTICLE_REQUEST';
export const CREATE_ARTICLE_SUCCESS = 'CREATE_ARTICLE_SUCCESS';
export const CREATE_ARTICLE_FAILURE = 'CREATE_ARTICLE_FAILURE';

export const UPDATE_ARTICLE_REQUEST = 'UPDATE_ARTICLE_REQUEST';
export const UPDATE_ARTICLE_SUCCESS = 'UPDATE_ARTICLE_SUCCESS';
export const UPDATE_ARTICLE_FAILURE = 'UPDATE_ARTICLE_FAILURE';

export const DELETE_ARTICLE_REQUEST = 'DELETE_ARTICLE_REQUEST';
export const DELETE_ARTICLE_SUCCESS = 'DELETE_ARTICLE_SUCCESS';
export const DELETE_ARTICLE_FAILURE = 'DELETE_ARTICLE_FAILURE';

export const CLEAR_ARTICLE_ERROR = 'CLEAR_ARTICLE_ERROR';
export const SET_SELECTED_ARTICLE = 'SET_SELECTED_ARTICLE';

// Action Creators
export const fetchArticlesRequest = () => ({
  type: FETCH_ARTICLES_REQUEST
});

export const fetchArticlesSuccess = (articles) => ({
  type: FETCH_ARTICLES_SUCCESS,
  payload: articles
});

export const fetchArticlesFailure = (error) => ({
  type: FETCH_ARTICLES_FAILURE,
  payload: error
});

export const fetchArticleByIdRequest = () => ({
  type: FETCH_ARTICLE_BY_ID_REQUEST
});

export const fetchArticleByIdSuccess = (article) => ({
  type: FETCH_ARTICLE_BY_ID_SUCCESS,
  payload: article
});

export const fetchArticleByIdFailure = (error) => ({
  type: FETCH_ARTICLE_BY_ID_FAILURE,
  payload: error
});

export const createArticleRequest = () => ({
  type: CREATE_ARTICLE_REQUEST
});

export const createArticleSuccess = (article) => ({
  type: CREATE_ARTICLE_SUCCESS,
  payload: article
});

export const createArticleFailure = (error) => ({
  type: CREATE_ARTICLE_FAILURE,
  payload: error
});

export const updateArticleRequest = () => ({
  type: UPDATE_ARTICLE_REQUEST
});

export const updateArticleSuccess = (article) => ({
  type: UPDATE_ARTICLE_SUCCESS,
  payload: article
});

export const updateArticleFailure = (error) => ({
  type: UPDATE_ARTICLE_FAILURE,
  payload: error
});

export const deleteArticleRequest = () => ({
  type: DELETE_ARTICLE_REQUEST
});

export const deleteArticleSuccess = (articleId) => ({
  type: DELETE_ARTICLE_SUCCESS,
  payload: articleId
});

export const deleteArticleFailure = (error) => ({
  type: DELETE_ARTICLE_FAILURE,
  payload: error
});

export const clearArticleError = () => ({
  type: CLEAR_ARTICLE_ERROR
});

export const setSelectedArticle = (article) => ({
  type: SET_SELECTED_ARTICLE,
  payload: article
});
