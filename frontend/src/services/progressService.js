import api from './api';

const progressService = {
  getProgress: async () => {
    const response = await api.get('/progress/me');
    return response.data;
  },

  updateProgress: async (action) => {
    const response = await api.post('/progress/update', { action });
    return response.data;
  }
};

export default progressService;
