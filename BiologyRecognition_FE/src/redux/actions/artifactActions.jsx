// Artifact action types
export const FETCH_ARTIFACTS_REQUEST = 'FETCH_ARTIFACTS_REQUEST';
export const FETCH_ARTIFACTS_SUCCESS = 'FETCH_ARTIFACTS_SUCCESS';
export const FETCH_ARTIFACTS_FAILURE = 'FETCH_ARTIFACTS_FAILURE';

export const FETCH_ARTIFACT_BY_ID_REQUEST = 'FETCH_ARTIFACT_BY_ID_REQUEST';
export const FETCH_ARTIFACT_BY_ID_SUCCESS = 'FETCH_ARTIFACT_BY_ID_SUCCESS';
export const FETCH_ARTIFACT_BY_ID_FAILURE = 'FETCH_ARTIFACT_BY_ID_FAILURE';

// Artifact action creators
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
