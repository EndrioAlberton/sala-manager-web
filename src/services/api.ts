import axios from 'axios';
import { ClassRoom } from '../types/ClassRoom';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface SearchFilters {
  searchTerm: string;
  maxStudents: number | '';
  hasProjector: boolean;
  isOccupied?: boolean;
}

export const classroomService = {
  findAll: async (): Promise<ClassRoom[]> => {
    const response = await api.get('/classrooms');
    return response.data;
  },

  searchByFilters: async (filters: SearchFilters): Promise<ClassRoom[]> => {
    const response = await api.get('/classrooms');
    const classrooms: ClassRoom[] = response.data;

    return classrooms.filter(classroom => {
      // Filtro por ocupação
      if (filters.isOccupied !== undefined) {
        if (filters.isOccupied !== classroom.isOccupied) {
          return false;
        }
      }

      // Filtro por termo de busca (número da sala, professor ou disciplina)
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesRoom = classroom.roomNumber.toString().toLowerCase().includes(searchTerm);
        const matchesTeacher = classroom.currentTeacher?.toLowerCase().includes(searchTerm);
        const matchesSubject = classroom.currentSubject?.toLowerCase().includes(searchTerm);
        
        if (!matchesRoom && !matchesTeacher && !matchesSubject) {
          return false;
        }
      }

      // Filtro por capacidade mínima
      if (filters.maxStudents && classroom.maxStudents < filters.maxStudents) {
        return false;
      }

      // Filtro por projetor - corrigido
      if (filters.hasProjector && classroom.projectors === 0) {
        return false;
      }

      return true;
    });
  },

  searchByRoomNumber: async (roomNumber: string): Promise<ClassRoom[]> => {
    const response = await api.get(`/classrooms/search?roomNumber=${roomNumber}`);
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