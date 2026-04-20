import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 10000,
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error('API Error:', err);
        return Promise.reject(err);
    }
);

export const fetchDummyJobs = async (limit = 20) => {
    const response = await api.get(`/products?limit=${limit}`);
    // Map generic product data to job entries for practice
    return response.data.products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        company: p.brand || 'Unknown Inc.',
        category: p.category,
        salary: Math.round(p.price * 1000),
    }));
};

export default api;
