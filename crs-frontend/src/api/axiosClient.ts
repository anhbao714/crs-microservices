import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('crs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.log('[Interceptor] Error status:', error.response?.status);
      if (error.response?.status === 401) {
        console.log('[Interceptor] 401 detected - clearing storage and redirecting');
        localStorage.removeItem('crs_token');
        localStorage.removeItem('crs_user');
        // Dispatch custom event for AuthContext to listen and update state
        window.dispatchEvent(new CustomEvent('unauthorized'));
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          console.log('[Interceptor] Redirecting to /login');
          setTimeout(() => {
            window.location.href = '/login';
          }, 0);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
