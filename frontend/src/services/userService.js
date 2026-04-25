import api from './api';

const userService = {
  getProfile: async () => {
    try {
      const { data } = await api.get('/users/profile');
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  updateProfile: async (profileData) => {
    try {
      const { data } = await api.put('/users/profile', profileData);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default userService;
