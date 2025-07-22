// Recognition Actions
export const FETCH_RECOGNITIONS_REQUEST = 'FETCH_RECOGNITIONS_REQUEST';
export const FETCH_RECOGNITIONS_SUCCESS = 'FETCH_RECOGNITIONS_SUCCESS';
export const FETCH_RECOGNITIONS_FAILURE = 'FETCH_RECOGNITIONS_FAILURE';

export const SEARCH_RECOGNITIONS_REQUEST = 'SEARCH_RECOGNITIONS_REQUEST';
export const SEARCH_RECOGNITIONS_SUCCESS = 'SEARCH_RECOGNITIONS_SUCCESS';
export const SEARCH_RECOGNITIONS_FAILURE = 'SEARCH_RECOGNITIONS_FAILURE';

export const CLEAR_RECOGNITION_ERROR = 'CLEAR_RECOGNITION_ERROR';

// Fetch recognitions actions
export const fetchRecognitionsRequest = () => ({
  type: FETCH_RECOGNITIONS_REQUEST
});

export const fetchRecognitionsSuccess = (recognitions) => ({
  type: FETCH_RECOGNITIONS_SUCCESS,
  payload: recognitions
});

export const fetchRecognitionsFailure = (error) => ({
  type: FETCH_RECOGNITIONS_FAILURE,
  payload: error
});

// Search recognitions actions
export const searchRecognitionsRequest = () => ({
  type: SEARCH_RECOGNITIONS_REQUEST
});

export const searchRecognitionsSuccess = (recognitions) => ({
  type: SEARCH_RECOGNITIONS_SUCCESS,
  payload: recognitions
});

export const searchRecognitionsFailure = (error) => ({
  type: SEARCH_RECOGNITIONS_FAILURE,
  payload: error
});

// Clear error action
export const clearRecognitionError = () => ({
  type: CLEAR_RECOGNITION_ERROR
});
