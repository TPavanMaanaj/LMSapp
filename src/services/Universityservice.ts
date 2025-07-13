import api from './api';

const BASE_URL = '/universities';

export interface University {
  id?: number;
  uniName: string;
  estYear: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  adminName: string;
  students: number;
  courses: number;
}

export const getAllUniversities = () => {
  return api.get<University[]>(BASE_URL);
};

export const getUniversityById = (id: number) => {
  return api.get<University>(`${BASE_URL}/${id}`);
};

export const createUniversity = (data: University) => {
  return api.post<University>(BASE_URL, data);
};

export const updateUniversity = (id: number, data: University) => {
  return api.put<University>(`${BASE_URL}/${id}`, data);
};

export const deleteUniversity = (id: number) => {
  return api.delete(`${BASE_URL}/${id}`);
};
