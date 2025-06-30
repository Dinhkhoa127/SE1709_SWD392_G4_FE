import {
    FETCH_ARTIFACTS_REQUEST,
    FETCH_ARTIFACTS_SUCCESS,
    FETCH_ARTIFACTS_FAILURE,
    FETCH_ARTIFACT_BY_ID_REQUEST,
    FETCH_ARTIFACT_BY_ID_SUCCESS,
    FETCH_ARTIFACT_BY_ID_FAILURE
} from '../actions/artifactActions';

const initialState = {
    artifacts: [],
    artifact: null,
    loading: false,
    error: null
};

const artifactReducer = (state = initialState, action) => {
    switch (action.type) {
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
                error: null
            };
        case FETCH_ARTIFACTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
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
                artifact: action.payload,
                error: null
            };
        case FETCH_ARTIFACT_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default artifactReducer;
