import {
  FETCH_ARTICLES_REQUEST,
  FETCH_ARTICLES_SUCCESS,
  FETCH_ARTICLES_FAILURE,
  FETCH_ARTICLE_BY_ID_REQUEST,
  FETCH_ARTICLE_BY_ID_SUCCESS,
  FETCH_ARTICLE_BY_ID_FAILURE,
  CREATE_ARTICLE_REQUEST,
  CREATE_ARTICLE_SUCCESS,
  CREATE_ARTICLE_FAILURE,
  UPDATE_ARTICLE_REQUEST,
  UPDATE_ARTICLE_SUCCESS,
  UPDATE_ARTICLE_FAILURE,
  DELETE_ARTICLE_REQUEST,
  DELETE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_FAILURE,
  CLEAR_ARTICLE_ERROR,
  SET_SELECTED_ARTICLE
} from '../actions/articleActions';

const initialState = {
  articles: [],
  selectedArticle: null,
  loading: false,
  fetchArticleLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
};

const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Articles
    case FETCH_ARTICLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_ARTICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        articles: action.payload,
        error: null
      };
      
    case FETCH_ARTICLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch Article by ID
    case FETCH_ARTICLE_BY_ID_REQUEST:
      return {
        ...state,
        fetchArticleLoading: true,
        error: null
      };
      
    case FETCH_ARTICLE_BY_ID_SUCCESS:
      return {
        ...state,
        fetchArticleLoading: false,
        selectedArticle: action.payload,
        error: null
      };
      
    case FETCH_ARTICLE_BY_ID_FAILURE:
      return {
        ...state,
        fetchArticleLoading: false,
        error: action.payload
      };

    // Create Article
    case CREATE_ARTICLE_REQUEST:
      return {
        ...state,
        creating: true,
        error: null
      };
      
    case CREATE_ARTICLE_SUCCESS:
      // Add new article to the beginning of the list for immediate display
      return {
        ...state,
        creating: false,
        articles: [action.payload, ...state.articles],
        error: null
      };
      
    case CREATE_ARTICLE_FAILURE:
      return {
        ...state,
        creating: false,
        error: action.payload
      };

    // Update Article
    case UPDATE_ARTICLE_REQUEST:
      return {
        ...state,
        updating: true,
        error: null
      };
      
    case UPDATE_ARTICLE_SUCCESS:
      // Kiểm tra xem payload có tồn tại không
      if (!action.payload) {
        return {
          ...state,
          updating: false,
          error: null
        };
      }
      
      // Lấy ID từ payload (có thể là articleId hoặc article_id)
      const updatedId = action.payload.articleId || action.payload.article_id;
      
      return {
        ...state,
        updating: false,
        articles: state.articles.map(article => {
          const currentId = article.articleId || article.article_id;
          return currentId === updatedId ? { ...article, ...action.payload } : article;
        }),
        selectedArticle: action.payload,
        error: null
      };
      
    case UPDATE_ARTICLE_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload
      };

    // Delete Article
    case DELETE_ARTICLE_REQUEST:
      return {
        ...state,
        deleting: true,
        error: null
      };
      
    case DELETE_ARTICLE_SUCCESS:
      return {
        ...state,
        deleting: false,
        articles: state.articles.filter(article => 
          (article.articleId || article.article_id) !== action.payload
        ),
        selectedArticle: state.selectedArticle && 
          (state.selectedArticle.articleId || state.selectedArticle.article_id) === action.payload 
            ? null 
            : state.selectedArticle,
        error: null
      };
      
    case DELETE_ARTICLE_FAILURE:
      return {
        ...state,
        deleting: false,
        error: action.payload
      };

    // Utility Actions
    case CLEAR_ARTICLE_ERROR:
      return {
        ...state,
        error: null
      };
      
    case SET_SELECTED_ARTICLE:
      return {
        ...state,
        selectedArticle: action.payload
      };

    default:
      return state;
  }
};

export default articleReducer;
