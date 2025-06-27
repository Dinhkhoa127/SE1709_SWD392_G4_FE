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
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Interceptor response: tắt NProgress
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();

    return Promise.reject(error);
  }
);

export default instance;