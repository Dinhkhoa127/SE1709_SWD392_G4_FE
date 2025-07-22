import axios from "axios";
import NProgress from "nprogress";

// Cấu hình NProgress
NProgress.configure({ showSpinner: false, trickleSpeed: 100 });


const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_API_URL || "http://localhost:7198/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookie trong request
});


instance.interceptors.request.use(
  (config) => {
    NProgress.start();
    
    // Debug log for API calls
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    
    // Tự động thêm token vào header nếu có
    const token = localStorage.getItem('accessToken'); // Sửa từ 'token' thành 'accessToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Interceptor response: tắt NProgress và xử lý lỗi authentication
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, response);
    return response.data;
  },
  (error) => {
    NProgress.done();
    
    // Debug log for API errors
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      error: error.message
    });
    
    // Xử lý lỗi 405 (Method Not Allowed)
    if (error.response?.status === 405) {
      console.error('🚫 405 Method Not Allowed - The endpoint may not exist or the HTTP method is not supported');
      console.error('Check if the API endpoint exists and supports the HTTP method being used');
    }
    
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      // Clear localStorage và redirect về login
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken'); // Sửa từ 'token' thành 'accessToken'
      
      // Chỉ redirect nếu không phải ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;