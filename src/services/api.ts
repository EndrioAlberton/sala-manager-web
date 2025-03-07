import axios from 'axios';
import { ClassRoom } from '../types/ClassRoom';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface SearchFilters {
  searchTerm: string;
  maxStudents: number | '';
  hasProjector: boolean;
}

export const classroomService = {
  searchByFilters: async (filters: SearchFilters): Promise<ClassRoom[]> => {
    try {
      let results: ClassRoom[] = [];

      // Se houver termo de busca, tenta buscar por número da sala primeiro
      if (filters.searchTerm) {
        // Remove a palavra "sala" do termo de busca
        const searchTerm = filters.searchTerm.replace(/sala\s*/i, '').trim();
        
        if (searchTerm) {
          try {
            const roomResults = await classroomService.searchByRoomNumber(searchTerm);
            results = roomResults;
            console.log('Room search results:', roomResults);
          } catch (error) {
            console.log('No results found by room number');
          }
        }
      }

      // Se houver filtros adicionais, filtra os resultados
      if (filters.maxStudents !== '' || filters.hasProjector) {
        results = results.filter(classroom => {
          const matchesMaxStudents = filters.maxStudents === '' || 
            classroom.maxStudents >= filters.maxStudents;
          const matchesProjector = !filters.hasProjector || 
            (classroom.projectors !== undefined && classroom.projectors > 0);
          return matchesMaxStudents && matchesProjector;
        });
      }

      console.log('Final results:', results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

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