import api from './api';

const BASE_URL = '/courses';

export interface Course {
  id?: number;
  courseName: string;
  description: string;
  credits: number;
  instructor: string;
  universityId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export const getAllCourses = () => {
  return api.get<Course[]>(BASE_URL);
};

export const getCourseById = (id: number) => {
  return api.get<Course>(`${BASE_URL}/${id}`);
};

export const createCourse = (data: Course) => {
  return api.post<Course>(BASE_URL, data);
};

export const updateCourse = (id: number, data: Course) => {
  return api.put<Course>(`${BASE_URL}/${id}`, data);
};

export const deleteCourse = (id: number) => {
  return api.delete(`${BASE_URL}/${id}`);
};
