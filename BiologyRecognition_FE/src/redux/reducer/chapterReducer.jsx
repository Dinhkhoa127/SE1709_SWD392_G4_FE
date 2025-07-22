import {
  FETCH_CHAPTERS_REQUEST,
  FETCH_CHAPTERS_SUCCESS,
  FETCH_CHAPTERS_FAILURE,
  CREATE_CHAPTER_REQUEST,
  CREATE_CHAPTER_SUCCESS,
  CREATE_CHAPTER_FAILURE,
  UPDATE_CHAPTER_REQUEST,
  UPDATE_CHAPTER_SUCCESS,
  UPDATE_CHAPTER_FAILURE,
  FETCH_CHAPTER_BY_ID_REQUEST,
  FETCH_CHAPTER_BY_ID_SUCCESS,
  FETCH_CHAPTER_BY_ID_FAILURE,
  DELETE_CHAPTER_REQUEST,
  DELETE_CHAPTER_SUCCESS,
  DELETE_CHAPTER_FAILURE
} from '../actions/chapterActions';

const initialState = {
  chapters: [],
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  fetchChapterByIdLoading: false,
  selectedChapter: null
};

const chapterReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHAPTERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_CHAPTERS_SUCCESS:
      return {
        ...state,
        loading: false,
        chapters: action.payload,
        error: null
      };
    case FETCH_CHAPTERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        chapters: [] // Clear chapters when search fails
      };
    case CREATE_CHAPTER_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null
      };
    case CREATE_CHAPTER_SUCCESS:
      return {
        ...state,
        createLoading: false,
        chapters: [...state.chapters, action.payload],
        error: null
      };
    case CREATE_CHAPTER_FAILURE:
      return {
        ...state,
        createLoading: false,
        error: action.payload
      };
    case UPDATE_CHAPTER_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null
      };
    case UPDATE_CHAPTER_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        chapters: state.chapters.map(chapter => 
          chapter.chapterId === action.payload.chapterId ? action.payload : chapter
        ),
        error: null
      };
    case UPDATE_CHAPTER_FAILURE:
      return {
        ...state,
        updateLoading: false,
        error: action.payload
      };
    case FETCH_CHAPTER_BY_ID_REQUEST:
      return {
        ...state,
        fetchChapterByIdLoading: true,
        error: null
      };
    case FETCH_CHAPTER_BY_ID_SUCCESS:
      return {
        ...state,
        fetchChapterByIdLoading: false,
        selectedChapter: action.payload,
        error: null
      };
    case FETCH_CHAPTER_BY_ID_FAILURE:
      return {
        ...state,
        fetchChapterByIdLoading: false,
        error: action.payload
      };
    case DELETE_CHAPTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_CHAPTER_SUCCESS:
      return {
        ...state,
        loading: false,
        chapters: state.chapters.filter(chapter => chapter.chapterId !== action.payload),
        error: null
      };
    case DELETE_CHAPTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
      
  }
};

export default chapterReducer; 