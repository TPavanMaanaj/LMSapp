import api from './api';

const BASE_URL = '/students';

export interface Student {
  id?: number;
  studentId: string;
  fullName: string;
  email: string;
  major: string;
  year: string;
  phoneNumber: string;
  universityId: number;
}

export const getAllStudents = () => api.get<Student[]>(BASE_URL);

export const getStudentById = (id: number) => api.get<Student>(`${BASE_URL}/${id}`);

export const createStudent = (student: Student) => api.post<Student>(BASE_URL, student);

export const updateStudent = (id: number, student: Student) =>
  api.put<Student>(`${BASE_URL}/${id}`, student);

export const deleteStudent = (id: number) => api.delete(`${BASE_URL}/${id}`);
