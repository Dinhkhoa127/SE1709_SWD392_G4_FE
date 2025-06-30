import { toast } from 'react-toastify';
import { getArtifactsAPI, getArtifactByIdAPI } from '../services/apiService';
import {
    fetchArtifactsRequest,
    fetchArtifactsSuccess,
    fetchArtifactsFailure,
    fetchArtifactByIdRequest,
    fetchArtifactByIdSuccess,
    fetchArtifactByIdFailure
} from '../actions/artifactActions';

// Thunk to fetch all artifacts
export const fetchArtifacts = () => {
    return async (dispatch) => {
        dispatch(fetchArtifactsRequest());
        try {
            const response = await getArtifactsAPI();
            dispatch(fetchArtifactsSuccess(response.data));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Lỗi khi lấy danh sách artifact';
            dispatch(fetchArtifactsFailure(errorMessage));
            toast.error(errorMessage);
        }
    };
};

// Thunk to fetch artifact by ID
export const fetchArtifactById = (artifactId) => {
    return async (dispatch) => {
        dispatch(fetchArtifactByIdRequest());
        try {
            const response = await getArtifactByIdAPI(artifactId);
            dispatch(fetchArtifactByIdSuccess(response.data));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Lỗi khi lấy thông tin artifact';
            dispatch(fetchArtifactByIdFailure(errorMessage));
            toast.error(errorMessage);
        }
    };
};
