import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getNotifications = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const markAsRead = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}/${id}/read`, {}, config);
  return response.data;
};

const markAllAsRead = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}/read-all`, {}, config);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;
