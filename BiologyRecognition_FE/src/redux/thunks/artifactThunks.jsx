import {
    fetchArtifactsRequest,
    fetchArtifactsSuccess,
    fetchArtifactsFailure,
    fetchArtifactByIdRequest,
    fetchArtifactByIdSuccess,
    fetchArtifactByIdFailure,
    createArtifactRequest,
    createArtifactSuccess,
    createArtifactFailure,
    updateArtifactRequest,
    updateArtifactSuccess,
    updateArtifactFailure,
    deleteArtifactRequest,
    deleteArtifactSuccess,
    deleteArtifactFailure
} from '../actions/artifactActions';

import {
    getArtifactsAPI,
    getArtifactByIdAPI,
    createArtifactAPI,
    updateArtifactAPI,
    deleteArtifactAPI
} from '../services/apiService';

// Fetch all artifacts
export const fetchArtifactsThunk = () => {
    return async (dispatch) => {
        dispatch(fetchArtifactsRequest());
        try {
            const response = await getArtifactsAPI();
            // Vì axios interceptor đã return response.data, nên response chính là data
            dispatch(fetchArtifactsSuccess(response));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải dữ liệu artifacts';
            dispatch(fetchArtifactsFailure(errorMessage));
        }
    };
};

// Fetch artifact by ID
export const fetchArtifactByIdThunk = (artifactId) => {
    return async (dispatch) => {
        dispatch(fetchArtifactByIdRequest());
        try {
            const response = await getArtifactByIdAPI(artifactId);
            dispatch(fetchArtifactByIdSuccess(response.data));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải artifact';
            dispatch(fetchArtifactByIdFailure(errorMessage));
        }
    };
};

// Create artifact
export const createArtifactThunk = (artifactData) => {
    return async (dispatch) => {
        dispatch(createArtifactRequest());
        try {
            const response = await createArtifactAPI(artifactData);
            
            dispatch(createArtifactSuccess(response.data || response));
            // Refresh artifacts list after create
            dispatch(fetchArtifactsThunk());
            return response.data || response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tạo artifact';
            dispatch(createArtifactFailure(errorMessage));
            throw error;
        }
    };
};

// Update artifact
export const updateArtifactThunk = (artifactData) => {
    return async (dispatch) => {
        dispatch(updateArtifactRequest());
        try {
            const response = await updateArtifactAPI(artifactData);
            
            dispatch(updateArtifactSuccess(response.data || response));
            // Refresh artifacts list after update
            dispatch(fetchArtifactsThunk());
            return response.data || response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi cập nhật artifact';
            dispatch(updateArtifactFailure(errorMessage));
            throw error;
        }
    };
};

// Delete artifact
export const deleteArtifactThunk = (artifactId) => {
    return async (dispatch) => {
        dispatch(deleteArtifactRequest());
        try {
            await deleteArtifactAPI(artifactId);
            dispatch(deleteArtifactSuccess(artifactId));
            // Refresh artifacts list after delete
            dispatch(fetchArtifactsThunk());
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xóa artifact';
            dispatch(deleteArtifactFailure(errorMessage));
            throw error;
        }
    };
};
