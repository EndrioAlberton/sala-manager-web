import axios from 'axios';
import { ClassRoom } from '../types/ClassRoom';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const classroomService = {
  searchByRoomNumber: async (roomNumber: string): Promise<ClassRoom[]> => {
    const response = await api.get(`/classrooms/search?roomNumber=${roomNumber}`);
    return response.data;
  },

  findAll: async (): Promise<ClassRoom[]> => {
    const response = await api.get('/classrooms');
    return response.data;
  },

  findAvailable: async (): Promise<ClassRoom[]> => {
    const response = await api.get('/classrooms/available');
    return response.data;
  },

  findOne: async (id: number): Promise<ClassRoom> => {
    const response = await api.get(`/classrooms/${id}`);
    return response.data;
  },

  create: async (classroom: Partial<ClassRoom>): Promise<ClassRoom> => {
    const response = await api.post('/classrooms', classroom);
    return response.data;
  },

  update: async (id: number, classroom: Partial<ClassRoom>): Promise<ClassRoom> => {
    const response = await api.put(`/classrooms/${id}`, classroom);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/classrooms/${id}`);
  },

  occupy: async (id: number, teacher: string, subject: string): Promise<ClassRoom> => {
    const response = await api.put(`/classrooms/${id}/occupy`, { teacher, subject });
    return response.data;
  },

  vacate: async (id: number): Promise<ClassRoom> => {
    const response = await api.put(`/classrooms/${id}/vacate`);
    return response.data;
  },
}; 