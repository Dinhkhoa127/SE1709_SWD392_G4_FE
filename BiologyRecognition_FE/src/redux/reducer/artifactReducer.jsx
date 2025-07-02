import {
    FETCH_ARTIFACTS_REQUEST,
    FETCH_ARTIFACTS_SUCCESS,
    FETCH_ARTIFACTS_FAILURE,
    FETCH_ARTIFACT_BY_ID_REQUEST,
    FETCH_ARTIFACT_BY_ID_SUCCESS,
    FETCH_ARTIFACT_BY_ID_FAILURE,
    CREATE_ARTIFACT_REQUEST,
    CREATE_ARTIFACT_SUCCESS,
    CREATE_ARTIFACT_FAILURE,
    UPDATE_ARTIFACT_REQUEST,
    UPDATE_ARTIFACT_SUCCESS,
    UPDATE_ARTIFACT_FAILURE,
    DELETE_ARTIFACT_REQUEST,
    DELETE_ARTIFACT_SUCCESS,
    DELETE_ARTIFACT_FAILURE,
    CLEAR_ARTIFACT_ERROR,
    RESET_ARTIFACTS
} from '../actions/artifactActions';

const initialState = {
    artifacts: [],
    selectedArtifact: null,
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    lastFetch: null
};

const artifactReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch artifacts
        case FETCH_ARTIFACTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_ARTIFACTS_SUCCESS:
            return {
                ...state,
                loading: false,
                artifacts: action.payload,
                error: null,
                lastFetch: new Date().toISOString()
            };

        case FETCH_ARTIFACTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // Fetch artifact by ID
        case FETCH_ARTIFACT_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_ARTIFACT_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedArtifact: action.payload,
                error: null
            };

        case FETCH_ARTIFACT_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // Create artifact
        case CREATE_ARTIFACT_REQUEST:
            return {
                ...state,
                creating: true,
                error: null
            };

        case CREATE_ARTIFACT_SUCCESS:
            return {
                ...state,
                creating: false,
                artifacts: [...state.artifacts, action.payload],
                error: null
            };

        case CREATE_ARTIFACT_FAILURE:
            return {
                ...state,
                creating: false,
                error: action.payload
            };

        // Update artifact
        case UPDATE_ARTIFACT_REQUEST:
            return {
                ...state,
                updating: true,
                error: null
            };

        case UPDATE_ARTIFACT_SUCCESS:
            return {
                ...state,
                updating: false,
                artifacts: state.artifacts.map(artifact =>
                    artifact.artifactId === action.payload.artifactId
                        ? action.payload
                        : artifact
                ),
                selectedArtifact: action.payload,
                error: null
            };

        case UPDATE_ARTIFACT_FAILURE:
            return {
                ...state,
                updating: false,
                error: action.payload
            };

        // Delete artifact
        case DELETE_ARTIFACT_REQUEST:
            return {
                ...state,
                deleting: true,
                error: null
            };

        case DELETE_ARTIFACT_SUCCESS:
            return {
                ...state,
                deleting: false,
                artifacts: state.artifacts.filter(artifact => artifact.artifactId !== action.payload),
                error: null
            };

        case DELETE_ARTIFACT_FAILURE:
            return {
                ...state,
                deleting: false,
                error: action.payload
            };

        // Clear error
        case CLEAR_ARTIFACT_ERROR:
            return {
                ...state,
                error: null
            };

        // Reset artifacts
        case RESET_ARTIFACTS:
            return {
                ...initialState
            };

        default:
            return state;
    }
};

export default artifactReducer;
