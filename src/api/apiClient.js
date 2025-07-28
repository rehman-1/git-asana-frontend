import axios from "axios";

// const API_BASE = "http://localhost:8000";
const API_BASE = "http://192.168.3.134:8000";

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE,
    // timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Git endpoints
export const getGitReport = (startDate, endDate) =>
    apiClient.post(`/api/git/report?start_date=${startDate}&end_date=${endDate}`);

export const reloadGitData = () =>
    apiClient.post('/api/git/reload');

// Asana endpoints
export const getAsanaSummary = () =>
    apiClient.get('/api/asana/summary');

export const reloadAsanaData = () =>
    apiClient.post('/api/asana/reload');

export const getDeveloperEfforts = (startDate, endDate) =>
    apiClient.post(`/api/asana/efforts?start_date=${startDate}&end_date=${endDate}`);

export const getDeveloperSummary = (startDate, endDate) =>
    apiClient.post(`/api/asana/developer_summary?start_date=${startDate}&end_date=${endDate}`);

// Analytics endpoint
export const getAnalytics = (startDate, endDate) =>
    apiClient.get(`/api/analytics?start_date=${startDate}&end_date=${endDate}`);

// Combined reload
export const reloadAll = () =>
    apiClient.post('/reload_all');

export default apiClient;