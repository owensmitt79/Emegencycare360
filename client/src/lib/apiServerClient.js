// Points to the local Express API server.
// In production, change this to your deployed API URL.
const API_SERVER_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

const apiServerClient = {
    get: async (url, options = {}) => {
        return await window.fetch(API_SERVER_URL + url, { ...options, method: 'GET' });
    },
    post: async (url, body, options = {}) => {
        return await window.fetch(API_SERVER_URL + url, {
            ...options,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...options.headers },
            body: JSON.stringify(body),
        });
    },
    put: async (url, body, options = {}) => {
        return await window.fetch(API_SERVER_URL + url, {
            ...options,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...options.headers },
            body: JSON.stringify(body),
        });
    },
    delete: async (url, options = {}) => {
        return await window.fetch(API_SERVER_URL + url, { ...options, method: 'DELETE' });
    },
    fetch: async (url, options = {}) => {
        return await window.fetch(API_SERVER_URL + url, options);
    }
};

export default apiServerClient;
export { apiServerClient };
