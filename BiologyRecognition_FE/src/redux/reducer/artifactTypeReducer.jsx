import {
  FETCH_ARTIFACT_TYPES_REQUEST,
  FETCH_ARTIFACT_TYPES_SUCCESS,
  FETCH_ARTIFACT_TYPES_FAILURE,
  FETCH_ARTIFACT_TYPE_BY_ID_REQUEST,
  FETCH_ARTIFACT_TYPE_BY_ID_SUCCESS,
  FETCH_ARTIFACT_TYPE_BY_ID_FAILURE,
  CREATE_ARTIFACT_TYPE_REQUEST,
  CREATE_ARTIFACT_TYPE_SUCCESS,
  CREATE_ARTIFACT_TYPE_FAILURE,
  UPDATE_ARTIFACT_TYPE_REQUEST,
  UPDATE_ARTIFACT_TYPE_SUCCESS,
  UPDATE_ARTIFACT_TYPE_FAILURE,
  DELETE_ARTIFACT_TYPE_REQUEST,
  DELETE_ARTIFACT_TYPE_SUCCESS,
  DELETE_ARTIFACT_TYPE_FAILURE
} from '../actions/artifactTypeActions';

const initialState = {
  artifactTypes: [],
  selectedArtifactType: null,
  loading: false,
  fetchArtifactTypeLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null
};

const artifactTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all artifact types
    case FETCH_ARTIFACT_TYPES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ARTIFACT_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        artifactTypes: action.payload,
        error: null
      };
    case FETCH_ARTIFACT_TYPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch artifact type by ID
    case FETCH_ARTIFACT_TYPE_BY_ID_REQUEST:
      return {
        ...state,
        fetchArtifactTypeLoading: true,
        error: null
      };
    case FETCH_ARTIFACT_TYPE_BY_ID_SUCCESS:
      return {
        ...state,
        fetchArtifactTypeLoading: false,
        selectedArtifactType: action.payload,
        error: null
      };
    case FETCH_ARTIFACT_TYPE_BY_ID_FAILURE:
      return {
        ...state,
        fetchArtifactTypeLoading: false,
        error: action.payload
      };

    // Create artifact type
    case CREATE_ARTIFACT_TYPE_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null
      };
    case CREATE_ARTIFACT_TYPE_SUCCESS:
      return {
        ...state,
        createLoading: false,
        artifactTypes: [...state.artifactTypes, action.payload],
        error: null
      };
    case CREATE_ARTIFACT_TYPE_FAILURE:
      return {
        ...state,
        createLoading: false,
        error: action.payload
      };

    // Update artifact type
    case UPDATE_ARTIFACT_TYPE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null
      };
    case UPDATE_ARTIFACT_TYPE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        artifactTypes: state.artifactTypes.map(artifactType => 
          artifactType.artifactTypeId === action.payload.artifactTypeId 
            ? action.payload 
            : artifactType
        ),
        selectedArtifactType: action.payload,
        error: null
      };
    case UPDATE_ARTIFACT_TYPE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        error: action.payload
      };

    // Delete artifact type
    case DELETE_ARTIFACT_TYPE_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null
      };
    case DELETE_ARTIFACT_TYPE_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        artifactTypes: state.artifactTypes.filter(artifactType => 
          artifactType.artifactTypeId !== action.payload
        ),
        error: null
      };
    case DELETE_ARTIFACT_TYPE_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default artifactTypeReducer;
