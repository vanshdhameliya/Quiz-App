import axios from 'axios';

const AUTH_KEY = 'quizapp_admin_auth';

export function getStoredAuthHeader() {
  return localStorage.getItem(AUTH_KEY);
}

export function setStoredAuthHeader(header) {
  localStorage.setItem(AUTH_KEY, header);
}

export function clearStoredAuthHeader() {
  localStorage.removeItem(AUTH_KEY);
}

// Separate instance (not the public one in axiosConfig.js) because every
// request here needs the admin's Basic auth header attached automatically.
const adminApi = axios.create({
  baseURL: 'http://localhost:8080/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const authHeader = getStoredAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearStoredAuthHeader();
      window.dispatchEvent(new Event('admin-auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default adminApi;
