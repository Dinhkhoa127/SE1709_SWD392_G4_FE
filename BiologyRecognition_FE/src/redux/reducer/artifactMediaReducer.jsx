import {
  FETCH_ARTIFACT_MEDIA_REQUEST,
  FETCH_ARTIFACT_MEDIA_SUCCESS,
  FETCH_ARTIFACT_MEDIA_FAILURE,
  FETCH_ARTIFACT_MEDIA_BY_ID_REQUEST,
  FETCH_ARTIFACT_MEDIA_BY_ID_SUCCESS,
  FETCH_ARTIFACT_MEDIA_BY_ID_FAILURE,
  CREATE_ARTIFACT_MEDIA_REQUEST,
  CREATE_ARTIFACT_MEDIA_SUCCESS,
  CREATE_ARTIFACT_MEDIA_FAILURE,
  UPDATE_ARTIFACT_MEDIA_REQUEST,
  UPDATE_ARTIFACT_MEDIA_SUCCESS,
  UPDATE_ARTIFACT_MEDIA_FAILURE,
  DELETE_ARTIFACT_MEDIA_REQUEST,
  DELETE_ARTIFACT_MEDIA_SUCCESS,
  DELETE_ARTIFACT_MEDIA_FAILURE
} from '../actions/artifactMediaActions';

const initialState = {
  artifactMedia: [],
  selectedArtifactMedia: null,
  loading: false,
  fetchArtifactMediaLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null
};

const artifactMediaReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all artifact media
    case FETCH_ARTIFACT_MEDIA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ARTIFACT_MEDIA_SUCCESS:
      return {
        ...state,
        loading: false,
        artifactMedia: action.payload,
        error: null
      };
    case FETCH_ARTIFACT_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch artifact media by ID
    case FETCH_ARTIFACT_MEDIA_BY_ID_REQUEST:
      return {
        ...state,
        fetchArtifactMediaLoading: true,
        error: null
      };
    case FETCH_ARTIFACT_MEDIA_BY_ID_SUCCESS:
      return {
        ...state,
        fetchArtifactMediaLoading: false,
        selectedArtifactMedia: action.payload,
        error: null
      };
    case FETCH_ARTIFACT_MEDIA_BY_ID_FAILURE:
      return {
        ...state,
        fetchArtifactMediaLoading: false,
        error: action.payload
      };

    // Create artifact media
    case CREATE_ARTIFACT_MEDIA_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null
      };
    case CREATE_ARTIFACT_MEDIA_SUCCESS:
      return {
        ...state,
        createLoading: false,
        artifactMedia: [...state.artifactMedia, action.payload],
        error: null
      };
    case CREATE_ARTIFACT_MEDIA_FAILURE:
      return {
        ...state,
        createLoading: false,
        error: action.payload
      };

    // Update artifact media
    case UPDATE_ARTIFACT_MEDIA_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null
      };
    case UPDATE_ARTIFACT_MEDIA_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        artifactMedia: state.artifactMedia.map(media => 
          media.artifactMediaId === action.payload.artifactMediaId 
            ? action.payload 
            : media
        ),
        selectedArtifactMedia: action.payload,
        error: null
      };
    case UPDATE_ARTIFACT_MEDIA_FAILURE:
      return {
        ...state,
        updateLoading: false,
        error: action.payload
      };

    // Delete artifact media
    case DELETE_ARTIFACT_MEDIA_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null
      };
    case DELETE_ARTIFACT_MEDIA_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        artifactMedia: state.artifactMedia.filter(media => 
          media.artifactMediaId !== action.payload
        ),
        error: null
      };
    case DELETE_ARTIFACT_MEDIA_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default artifactMediaReducer;
