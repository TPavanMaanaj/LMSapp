import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/universities';

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

export const getAllUniversities = () => axios.get<University[]>(BASE_URL);

export const getUniversityById = (id: number) => axios.get<University>(`${BASE_URL}/${id}`);

export const createUniversity = (university: University) => axios.post<University>(BASE_URL, university);

export const updateUniversity = (id: number, university: University) =>
  axios.put<University>(`${BASE_URL}/${id}`, university);

export const deleteUniversity = (id: number) => axios.delete(`${BASE_URL}/${id}`);
