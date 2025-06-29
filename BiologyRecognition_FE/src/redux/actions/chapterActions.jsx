// Action types
export const FETCH_CHAPTERS_REQUEST = 'FETCH_CHAPTERS_REQUEST';
export const FETCH_CHAPTERS_SUCCESS = 'FETCH_CHAPTERS_SUCCESS';
export const FETCH_CHAPTERS_FAILURE = 'FETCH_CHAPTERS_FAILURE';

export const CREATE_CHAPTER_REQUEST = 'CREATE_CHAPTER_REQUEST';
export const CREATE_CHAPTER_SUCCESS = 'CREATE_CHAPTER_SUCCESS';
export const CREATE_CHAPTER_FAILURE = 'CREATE_CHAPTER_FAILURE';

export const UPDATE_CHAPTER_REQUEST = 'UPDATE_CHAPTER_REQUEST';
export const UPDATE_CHAPTER_SUCCESS = 'UPDATE_CHAPTER_SUCCESS';
export const UPDATE_CHAPTER_FAILURE = 'UPDATE_CHAPTER_FAILURE';

export const FETCH_CHAPTER_BY_ID_REQUEST = 'FETCH_CHAPTER_BY_ID_REQUEST';
export const FETCH_CHAPTER_BY_ID_SUCCESS = 'FETCH_CHAPTER_BY_ID_SUCCESS';
export const FETCH_CHAPTER_BY_ID_FAILURE = 'FETCH_CHAPTER_BY_ID_FAILURE';

export const DELETE_CHAPTER_REQUEST = 'DELETE_CHAPTER_REQUEST';
export const DELETE_CHAPTER_SUCCESS = 'DELETE_CHAPTER_SUCCESS';
export const DELETE_CHAPTER_FAILURE = 'DELETE_CHAPTER_FAILURE';
// Action creators
export const fetchChaptersRequest = () => ({
  type: FETCH_CHAPTERS_REQUEST
});

export const fetchChaptersSuccess = (chapters) => ({
  type: FETCH_CHAPTERS_SUCCESS,
  payload: chapters
});

export const fetchChaptersFailure = (error) => ({
  type: FETCH_CHAPTERS_FAILURE,
  payload: error
});

export const createChapterRequest = () => ({
  type: CREATE_CHAPTER_REQUEST
});

export const createChapterSuccess = (chapter) => ({
  type: CREATE_CHAPTER_SUCCESS,
  payload: chapter
});

export const createChapterFailure = (error) => ({
  type: CREATE_CHAPTER_FAILURE,
  payload: error
}); 
export const updateChapterRequest = () => ({
  type: UPDATE_CHAPTER_REQUEST
});

export const updateChapterSuccess = (chapter) => ({
  type: UPDATE_CHAPTER_SUCCESS,
  payload: chapter
});

export const updateChapterFailure = (error) => ({
  type: UPDATE_CHAPTER_FAILURE,
  payload: error
});
export const fetchChapterByIdRequest = () => ({
  type: FETCH_CHAPTER_BY_ID_REQUEST
});

export const fetchChapterByIdSuccess = (chapter) => ({
  type: FETCH_CHAPTER_BY_ID_SUCCESS,
  payload: chapter
});

export const fetchChapterByIdFailure = (error) => ({
  type: FETCH_CHAPTER_BY_ID_FAILURE,
  payload: error
});
export const deleteChapterRequest = () => ({
  type: DELETE_CHAPTER_REQUEST
});
export const deleteChapterSuccess = (chapterId) => ({
  type: DELETE_CHAPTER_SUCCESS,
  payload: chapterId
});
export const deleteChapterFailure = (error) => ({
  type: DELETE_CHAPTER_FAILURE,
  payload: error
});