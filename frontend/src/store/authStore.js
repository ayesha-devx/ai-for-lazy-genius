import { create } from 'zustand';

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    localStorage.removeItem('user');
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem('user'),
  
  login: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));

export default useAuthStore;
