import axios from "axios";
import NProgress from "nprogress";

// Cấu hình NProgress
NProgress.configure({ showSpinner: false, trickleSpeed: 100 });


const instance = axios.create({
  baseURL: "", 
  headers: {
    "Content-Type": "application/json",
  },
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