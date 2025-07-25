import api from './api';

const BASE_URL = '/admins';

export interface Admin {
  id?: number;
  adminName: string;
  uniName: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  email: string;
  students: number;
  phnnum: number;
  department: number;
  adminStatus: 'ACTIVE' | 'INACTIVE';
}

export const getAllAdmins = () => {
  return api.get<Admin[]>(BASE_URL);
};

export const getAdminById = (id: number) => {
  return api.get<Admin>(`${BASE_URL}/${id}`);
};

export const createAdmin = (data: Admin) => {
  return api.post<Admin>(BASE_URL, data);
};

export const updateAdmin = (id: number, data: Admin) => {
  return api.put<Admin>(`${BASE_URL}/${id}`, data);
};

export const deleteAdmin = (id: number) => {
  return api.delete(`${BASE_URL}/${id}`);
};
