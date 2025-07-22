import { 
  fetchRecognitionsRequest, 
  fetchRecognitionsSuccess, 
  fetchRecognitionsFailure,
  searchRecognitionsRequest,
  searchRecognitionsSuccess,
  searchRecognitionsFailure
} from '../actions/recognitionActions';
import { 
  getRecognitionsAPI, 

} from '../services/apiService';

// Fetch all recognitions with pagination
export const fetchRecognitionsThunk = (params = {}) => async (dispatch) => {
  try {
    console.log('fetchRecognitionsThunk called with params:', params);
    dispatch(fetchRecognitionsRequest());
    
    const response = await getRecognitionsAPI(params);
    console.log('fetchRecognitionsThunk API response:', response);
    
    // Handle different response formats
    const data = response?.data || response;
    dispatch(fetchRecognitionsSuccess(data));
    return data;
  } catch (error) {
    console.error('fetchRecognitionsThunk error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải danh sách nhận diện';
    dispatch(fetchRecognitionsFailure(errorMessage));
    throw error;
  }
};

// Search recognitions by userId
export const searchRecognitions = (params = {}) => async (dispatch) => {
  try {
    console.log('searchRecognitions called with params:', params);
    dispatch(searchRecognitionsRequest());
    
    const response = await getRecognitionsAPI(params);
    console.log('searchRecognitions API response:', response);
    
    // Handle different response formats
    const data = response?.data || response;
    dispatch(searchRecognitionsSuccess(data));
    return data;
  } catch (error) {
    console.error('searchRecognitions error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tìm kiếm nhận diện';
    dispatch(searchRecognitionsFailure(errorMessage));
    throw error;
  }
};

// Get recognition by ID
export const getRecognitionByIdThunk = (recognitionId) => async (dispatch) => {
  try {
    console.log('getRecognitionByIdThunk called with ID:', recognitionId);
    
    const response = await getRecognitionsAPI({ id: recognitionId });
    console.log('getRecognitionByIdThunk API response:', response);
    
    // Handle different response formats
    const data = response?.data || response;
    return data;
  } catch (error) {
    console.error('getRecognitionByIdThunk error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải thông tin nhận diện';
    throw new Error(errorMessage);
  }
};
