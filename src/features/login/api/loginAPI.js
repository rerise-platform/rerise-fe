import axios from 'axios';

export const loginAPI = async (username, password) => {
  try {
    const response = await axios.post('/api/v1/users/login', {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
