import axiosInstance from './axiosInstance';

const studentApi = {
  list: (params) => axiosInstance.get('/students', { params }).then((res) => res.data),
  get: (id) => axiosInstance.get(`/students/${id}`).then((res) => res.data),
  create: (data) => axiosInstance.post('/students', data).then((res) => res.data),
  update: (id, data) => axiosInstance.patch(`/students/${id}`, data).then((res) => res.data),
  remove: (id) => axiosInstance.delete(`/students/${id}`).then((res) => res.data),
  uploadDocument: (id, file) => {
    const formData = new FormData();
    formData.append('document', file);
    return axiosInstance
      .post(`/students/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};

export default studentApi;
