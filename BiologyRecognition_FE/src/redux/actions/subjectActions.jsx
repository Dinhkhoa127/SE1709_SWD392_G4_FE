// Action types
export const FETCH_SUBJECTS_REQUEST = 'FETCH_SUBJECTS_REQUEST';
export const FETCH_SUBJECTS_SUCCESS = 'FETCH_SUBJECTS_SUCCESS';
export const FETCH_SUBJECTS_FAILURE = 'FETCH_SUBJECTS_FAILURE';

export const FETCH_SUBJECT_BY_ID_REQUEST = 'FETCH_SUBJECT_BY_ID_REQUEST';
export const FETCH_SUBJECT_BY_ID_SUCCESS = 'FETCH_SUBJECT_BY_ID_SUCCESS';
export const FETCH_SUBJECT_BY_ID_FAILURE = 'FETCH_SUBJECT_BY_ID_FAILURE';

export const CREATE_SUBJECT_REQUEST = 'CREATE_SUBJECT_REQUEST';
export const CREATE_SUBJECT_SUCCESS = 'CREATE_SUBJECT_SUCCESS';
export const CREATE_SUBJECT_FAILURE = 'CREATE_SUBJECT_FAILURE';

export const UPDATE_SUBJECT_REQUEST = 'UPDATE_SUBJECT_REQUEST';
export const UPDATE_SUBJECT_SUCCESS = 'UPDATE_SUBJECT_SUCCESS';
export const UPDATE_SUBJECT_FAILURE = 'UPDATE_SUBJECT_FAILURE';

export const DELETE_SUBJECT_REQUEST = 'DELETE_SUBJECT_REQUEST';
export const DELETE_SUBJECT_SUCCESS = 'DELETE_SUBJECT_SUCCESS';
export const DELETE_SUBJECT_FAILURE = 'DELETE_SUBJECT_FAILURE';

// Action creators
export const fetchSubjectsRequest = () => ({
  type: FETCH_SUBJECTS_REQUEST
});

export const fetchSubjectsSuccess = (subjects) => ({
  type: FETCH_SUBJECTS_SUCCESS,
  payload: subjects
});

export const fetchSubjectsFailure = (error) => ({
  type: FETCH_SUBJECTS_FAILURE,
  payload: error
});

export const fetchSubjectByIdRequest = () => ({
  type: FETCH_SUBJECT_BY_ID_REQUEST
});

export const fetchSubjectByIdSuccess = (subject) => ({
  type: FETCH_SUBJECT_BY_ID_SUCCESS,
  payload: subject
});

export const fetchSubjectByIdFailure = (error) => ({
  type: FETCH_SUBJECT_BY_ID_FAILURE,
  payload: error
});

export const createSubjectRequest = () => ({
  type: CREATE_SUBJECT_REQUEST
});

export const createSubjectSuccess = (subject) => ({
  type: CREATE_SUBJECT_SUCCESS,
  payload: subject
});

export const createSubjectFailure = (error) => ({
  type: CREATE_SUBJECT_FAILURE,
  payload: error
});

export const updateSubjectRequest = () => ({
  type: UPDATE_SUBJECT_REQUEST
});

export const updateSubjectSuccess = (subject) => ({
  type: UPDATE_SUBJECT_SUCCESS,
  payload: subject
});

export const updateSubjectFailure = (error) => ({
  type: UPDATE_SUBJECT_FAILURE,
  payload: error
});

export const deleteSubjectRequest = () => ({
  type: DELETE_SUBJECT_REQUEST
});

export const deleteSubjectSuccess = (subjectId) => ({
  type: DELETE_SUBJECT_SUCCESS,
  payload: subjectId
});

export const deleteSubjectFailure = (error) => ({
  type: DELETE_SUBJECT_FAILURE,
  payload: error
});
