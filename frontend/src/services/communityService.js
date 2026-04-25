import api from './api';

const communityService = {
  getAuthorProfile: async (id) => {
    const response = await api.get(`/community/author/${id}`);
    return response.data;
  },

  getTrendingCreators: async () => {
    const response = await api.get('/community/trending');
    return response.data;
  },

  followAuthor: async (id) => {
    const response = await api.post(`/community/follow/${id}`);
    return response.data;
  },

  unfollowAuthor: async (id) => {
    const response = await api.post(`/community/unfollow/${id}`);
    return response.data;
  }
};

export default communityService;
