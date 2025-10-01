import axios from 'axios';

const api = axios.create({
    baseURL: 'https://user-management-app-l764.onrender.com/api',
});

export default api;
