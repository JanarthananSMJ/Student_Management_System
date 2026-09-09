import axiosInstance from './axiosInstance';

const authApi = {
  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }).then((res) => res.data),
  me: () => axiosInstance.get('/auth/me').then((res) => res.data),
  changePassword: (currentPassword, newPassword) =>
    axiosInstance
      .patch('/auth/change-password', { currentPassword, newPassword })
      .then((res) => res.data),
};

export default authApi;
