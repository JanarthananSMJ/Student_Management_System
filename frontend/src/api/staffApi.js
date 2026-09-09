import axiosInstance from './axiosInstance';

const staffApi = {
  list: (params) => axiosInstance.get('/staff', { params }).then((res) => res.data),
  get: (id) => axiosInstance.get(`/staff/${id}`).then((res) => res.data),
  create: (data) => axiosInstance.post('/staff', data).then((res) => res.data),
  update: (id, data) => axiosInstance.patch(`/staff/${id}`, data).then((res) => res.data),
  remove: (id) => axiosInstance.delete(`/staff/${id}`).then((res) => res.data),
};

export default staffApi;
