import axiosInstance from './axiosInstance';

// Generic CRUD wrapper factory for simple reference-data resources that all
// share the same REST shape (departments, courses, subjects, etc).
export default function crudFactory(resourcePath) {
  return {
    list: (params) => axiosInstance.get(resourcePath, { params }).then((res) => res.data),
    get: (id) => axiosInstance.get(`${resourcePath}/${id}`).then((res) => res.data),
    create: (data) => axiosInstance.post(resourcePath, data).then((res) => res.data),
    update: (id, data) => axiosInstance.patch(`${resourcePath}/${id}`, data).then((res) => res.data),
    remove: (id) => axiosInstance.delete(`${resourcePath}/${id}`).then((res) => res.data),
  };
}
