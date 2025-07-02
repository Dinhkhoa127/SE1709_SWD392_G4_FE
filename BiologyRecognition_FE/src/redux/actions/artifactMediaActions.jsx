// ArtifactMedia Actions

// Fetch all artifact media
export const FETCH_ARTIFACT_MEDIA_REQUEST = 'FETCH_ARTIFACT_MEDIA_REQUEST';
export const FETCH_ARTIFACT_MEDIA_SUCCESS = 'FETCH_ARTIFACT_MEDIA_SUCCESS';
export const FETCH_ARTIFACT_MEDIA_FAILURE = 'FETCH_ARTIFACT_MEDIA_FAILURE';

export const fetchArtifactMediaRequest = () => ({
  type: FETCH_ARTIFACT_MEDIA_REQUEST
});

export const fetchArtifactMediaSuccess = (artifactMedia) => ({
  type: FETCH_ARTIFACT_MEDIA_SUCCESS,
  payload: artifactMedia
});

export const fetchArtifactMediaFailure = (error) => ({
  type: FETCH_ARTIFACT_MEDIA_FAILURE,
  payload: error
});

// Fetch artifact media by ID
export const FETCH_ARTIFACT_MEDIA_BY_ID_REQUEST = 'FETCH_ARTIFACT_MEDIA_BY_ID_REQUEST';
export const FETCH_ARTIFACT_MEDIA_BY_ID_SUCCESS = 'FETCH_ARTIFACT_MEDIA_BY_ID_SUCCESS';
export const FETCH_ARTIFACT_MEDIA_BY_ID_FAILURE = 'FETCH_ARTIFACT_MEDIA_BY_ID_FAILURE';

export const fetchArtifactMediaByIdRequest = () => ({
  type: FETCH_ARTIFACT_MEDIA_BY_ID_REQUEST
});

export const fetchArtifactMediaByIdSuccess = (artifactMedia) => ({
  type: FETCH_ARTIFACT_MEDIA_BY_ID_SUCCESS,
  payload: artifactMedia
});

export const fetchArtifactMediaByIdFailure = (error) => ({
  type: FETCH_ARTIFACT_MEDIA_BY_ID_FAILURE,
  payload: error
});

// Create artifact media
export const CREATE_ARTIFACT_MEDIA_REQUEST = 'CREATE_ARTIFACT_MEDIA_REQUEST';
export const CREATE_ARTIFACT_MEDIA_SUCCESS = 'CREATE_ARTIFACT_MEDIA_SUCCESS';
export const CREATE_ARTIFACT_MEDIA_FAILURE = 'CREATE_ARTIFACT_MEDIA_FAILURE';

export const createArtifactMediaRequest = () => ({
  type: CREATE_ARTIFACT_MEDIA_REQUEST
});

export const createArtifactMediaSuccess = (artifactMedia) => ({
  type: CREATE_ARTIFACT_MEDIA_SUCCESS,
  payload: artifactMedia
});

export const createArtifactMediaFailure = (error) => ({
  type: CREATE_ARTIFACT_MEDIA_FAILURE,
  payload: error
});

// Update artifact media
export const UPDATE_ARTIFACT_MEDIA_REQUEST = 'UPDATE_ARTIFACT_MEDIA_REQUEST';
export const UPDATE_ARTIFACT_MEDIA_SUCCESS = 'UPDATE_ARTIFACT_MEDIA_SUCCESS';
export const UPDATE_ARTIFACT_MEDIA_FAILURE = 'UPDATE_ARTIFACT_MEDIA_FAILURE';

export const updateArtifactMediaRequest = () => ({
  type: UPDATE_ARTIFACT_MEDIA_REQUEST
});

export const updateArtifactMediaSuccess = (artifactMedia) => ({
  type: UPDATE_ARTIFACT_MEDIA_SUCCESS,
  payload: artifactMedia
});

export const updateArtifactMediaFailure = (error) => ({
  type: UPDATE_ARTIFACT_MEDIA_FAILURE,
  payload: error
});

// Delete artifact media
export const DELETE_ARTIFACT_MEDIA_REQUEST = 'DELETE_ARTIFACT_MEDIA_REQUEST';
export const DELETE_ARTIFACT_MEDIA_SUCCESS = 'DELETE_ARTIFACT_MEDIA_SUCCESS';
export const DELETE_ARTIFACT_MEDIA_FAILURE = 'DELETE_ARTIFACT_MEDIA_FAILURE';

export const deleteArtifactMediaRequest = () => ({
  type: DELETE_ARTIFACT_MEDIA_REQUEST
});

export const deleteArtifactMediaSuccess = (artifactMediaId) => ({
  type: DELETE_ARTIFACT_MEDIA_SUCCESS,
  payload: artifactMediaId
});

export const deleteArtifactMediaFailure = (error) => ({
  type: DELETE_ARTIFACT_MEDIA_FAILURE,
  payload: error
});