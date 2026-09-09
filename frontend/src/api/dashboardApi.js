import axiosInstance from './axiosInstance';

const dashboardApi = {
  get: () => axiosInstance.get('/dashboard').then((res) => res.data),
};

export default dashboardApi;
