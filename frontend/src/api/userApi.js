import axiosInstance from './axiosInstance';
import crudFactory from './crudFactory';

const base = crudFactory('/users');

const userApi = {
  ...base,
  resetPassword: (id) =>
    axiosInstance.patch(`/users/${id}/reset-password`).then((res) => res.data),
};

export default userApi;
