// ArtifactType Actions

// Fetch all artifact types
export const FETCH_ARTIFACT_TYPES_REQUEST = 'FETCH_ARTIFACT_TYPES_REQUEST';
export const FETCH_ARTIFACT_TYPES_SUCCESS = 'FETCH_ARTIFACT_TYPES_SUCCESS';
export const FETCH_ARTIFACT_TYPES_FAILURE = 'FETCH_ARTIFACT_TYPES_FAILURE';

export const fetchArtifactTypesRequest = () => ({
  type: FETCH_ARTIFACT_TYPES_REQUEST
});

export const fetchArtifactTypesSuccess = (artifactTypes) => ({
  type: FETCH_ARTIFACT_TYPES_SUCCESS,
  payload: artifactTypes
});

export const fetchArtifactTypesFailure = (error) => ({
  type: FETCH_ARTIFACT_TYPES_FAILURE,
  payload: error
});

// Fetch artifact type by ID
export const FETCH_ARTIFACT_TYPE_BY_ID_REQUEST = 'FETCH_ARTIFACT_TYPE_BY_ID_REQUEST';
export const FETCH_ARTIFACT_TYPE_BY_ID_SUCCESS = 'FETCH_ARTIFACT_TYPE_BY_ID_SUCCESS';
export const FETCH_ARTIFACT_TYPE_BY_ID_FAILURE = 'FETCH_ARTIFACT_TYPE_BY_ID_FAILURE';

export const fetchArtifactTypeByIdRequest = () => ({
  type: FETCH_ARTIFACT_TYPE_BY_ID_REQUEST
});

export const fetchArtifactTypeByIdSuccess = (artifactType) => ({
  type: FETCH_ARTIFACT_TYPE_BY_ID_SUCCESS,
  payload: artifactType
});

export const fetchArtifactTypeByIdFailure = (error) => ({
  type: FETCH_ARTIFACT_TYPE_BY_ID_FAILURE,
  payload: error
});

// Create artifact type
export const CREATE_ARTIFACT_TYPE_REQUEST = 'CREATE_ARTIFACT_TYPE_REQUEST';
export const CREATE_ARTIFACT_TYPE_SUCCESS = 'CREATE_ARTIFACT_TYPE_SUCCESS';
export const CREATE_ARTIFACT_TYPE_FAILURE = 'CREATE_ARTIFACT_TYPE_FAILURE';

export const createArtifactTypeRequest = () => ({
  type: CREATE_ARTIFACT_TYPE_REQUEST
});

export const createArtifactTypeSuccess = (artifactType) => ({
  type: CREATE_ARTIFACT_TYPE_SUCCESS,
  payload: artifactType
});

export const createArtifactTypeFailure = (error) => ({
  type: CREATE_ARTIFACT_TYPE_FAILURE,
  payload: error
});

// Update artifact type
export const UPDATE_ARTIFACT_TYPE_REQUEST = 'UPDATE_ARTIFACT_TYPE_REQUEST';
export const UPDATE_ARTIFACT_TYPE_SUCCESS = 'UPDATE_ARTIFACT_TYPE_SUCCESS';
export const UPDATE_ARTIFACT_TYPE_FAILURE = 'UPDATE_ARTIFACT_TYPE_FAILURE';

export const updateArtifactTypeRequest = () => ({
  type: UPDATE_ARTIFACT_TYPE_REQUEST
});

export const updateArtifactTypeSuccess = (artifactType) => ({
  type: UPDATE_ARTIFACT_TYPE_SUCCESS,
  payload: artifactType
});

export const updateArtifactTypeFailure = (error) => ({
  type: UPDATE_ARTIFACT_TYPE_FAILURE,
  payload: error
});

// Delete artifact type
export const DELETE_ARTIFACT_TYPE_REQUEST = 'DELETE_ARTIFACT_TYPE_REQUEST';
export const DELETE_ARTIFACT_TYPE_SUCCESS = 'DELETE_ARTIFACT_TYPE_SUCCESS';
export const DELETE_ARTIFACT_TYPE_FAILURE = 'DELETE_ARTIFACT_TYPE_FAILURE';

export const deleteArtifactTypeRequest = () => ({
  type: DELETE_ARTIFACT_TYPE_REQUEST
});

export const deleteArtifactTypeSuccess = (artifactTypeId) => ({
  type: DELETE_ARTIFACT_TYPE_SUCCESS,
  payload: artifactTypeId
});

export const deleteArtifactTypeFailure = (error) => ({
  type: DELETE_ARTIFACT_TYPE_FAILURE,
  payload: error
});