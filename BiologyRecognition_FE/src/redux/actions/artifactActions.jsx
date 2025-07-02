// Artifact Action Types
export const FETCH_ARTIFACTS_REQUEST = 'FETCH_ARTIFACTS_REQUEST';
export const FETCH_ARTIFACTS_SUCCESS = 'FETCH_ARTIFACTS_SUCCESS';
export const FETCH_ARTIFACTS_FAILURE = 'FETCH_ARTIFACTS_FAILURE';

export const FETCH_ARTIFACT_BY_ID_REQUEST = 'FETCH_ARTIFACT_BY_ID_REQUEST';
export const FETCH_ARTIFACT_BY_ID_SUCCESS = 'FETCH_ARTIFACT_BY_ID_SUCCESS';
export const FETCH_ARTIFACT_BY_ID_FAILURE = 'FETCH_ARTIFACT_BY_ID_FAILURE';

export const CREATE_ARTIFACT_REQUEST = 'CREATE_ARTIFACT_REQUEST';
export const CREATE_ARTIFACT_SUCCESS = 'CREATE_ARTIFACT_SUCCESS';
export const CREATE_ARTIFACT_FAILURE = 'CREATE_ARTIFACT_FAILURE';

export const UPDATE_ARTIFACT_REQUEST = 'UPDATE_ARTIFACT_REQUEST';
export const UPDATE_ARTIFACT_SUCCESS = 'UPDATE_ARTIFACT_SUCCESS';
export const UPDATE_ARTIFACT_FAILURE = 'UPDATE_ARTIFACT_FAILURE';

export const DELETE_ARTIFACT_REQUEST = 'DELETE_ARTIFACT_REQUEST';
export const DELETE_ARTIFACT_SUCCESS = 'DELETE_ARTIFACT_SUCCESS';
export const DELETE_ARTIFACT_FAILURE = 'DELETE_ARTIFACT_FAILURE';

export const CLEAR_ARTIFACT_ERROR = 'CLEAR_ARTIFACT_ERROR';
export const RESET_ARTIFACTS = 'RESET_ARTIFACTS';

// Action Creators
export const fetchArtifactsRequest = () => ({
    type: FETCH_ARTIFACTS_REQUEST
});

export const fetchArtifactsSuccess = (artifacts) => ({
    type: FETCH_ARTIFACTS_SUCCESS,
    payload: artifacts
});

export const fetchArtifactsFailure = (error) => ({
    type: FETCH_ARTIFACTS_FAILURE,
    payload: error
});

export const fetchArtifactByIdRequest = () => ({
    type: FETCH_ARTIFACT_BY_ID_REQUEST
});

export const fetchArtifactByIdSuccess = (artifact) => ({
    type: FETCH_ARTIFACT_BY_ID_SUCCESS,
    payload: artifact
});

export const fetchArtifactByIdFailure = (error) => ({
    type: FETCH_ARTIFACT_BY_ID_FAILURE,
    payload: error
});

export const createArtifactRequest = () => ({
    type: CREATE_ARTIFACT_REQUEST
});

export const createArtifactSuccess = (artifact) => ({
    type: CREATE_ARTIFACT_SUCCESS,
    payload: artifact
});

export const createArtifactFailure = (error) => ({
    type: CREATE_ARTIFACT_FAILURE,
    payload: error
});

export const updateArtifactRequest = () => ({
    type: UPDATE_ARTIFACT_REQUEST
});

export const updateArtifactSuccess = (artifact) => ({
    type: UPDATE_ARTIFACT_SUCCESS,
    payload: artifact
});

export const updateArtifactFailure = (error) => ({
    type: UPDATE_ARTIFACT_FAILURE,
    payload: error
});

export const deleteArtifactRequest = () => ({
    type: DELETE_ARTIFACT_REQUEST
});

export const deleteArtifactSuccess = (artifactId) => ({
    type: DELETE_ARTIFACT_SUCCESS,
    payload: artifactId
});

export const deleteArtifactFailure = (error) => ({
    type: DELETE_ARTIFACT_FAILURE,
    payload: error
});

export const clearArtifactError = () => ({
    type: CLEAR_ARTIFACT_ERROR
});

export const resetArtifacts = () => ({
    type: RESET_ARTIFACTS
});
