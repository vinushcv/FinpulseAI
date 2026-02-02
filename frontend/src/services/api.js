import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://finpulseai-q6g9.onrender.com';

export const api = {
    // Companies
    createCompany: async (data) => {
        const response = await axios.post(`${API_URL}/companies/`, data);
        return response.data;
    },

    // Upload
    uploadFinancials: async (companyId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/upload/${companyId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    runSimulation: async (data) => {
        const response = await axios.post(`${API_URL}/simulate`, data);
        return response.data;
    },

    // Health Check
    checkHealth: async () => {
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    }
};
