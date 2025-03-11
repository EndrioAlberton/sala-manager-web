import axios, { AxiosError } from 'axios';
import { ClassRoom } from '../types/ClassRoom';
import { Occupation } from '../types/Occupation';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface SearchFilters {
  searchTerm: string;
  maxStudents: number | '';
  hasProjector: boolean;
}

export const classroomService = {
  findAll: async (): Promise<ClassRoom[]> => {
    const response = await api.get('/classrooms');
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
  }
};

export const occupationService = {
  create: async (data: {
    roomId: number;
    teacher: string;
    subject: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  }): Promise<Occupation> => {
    try {
      const response = await api.post('/occupations', data);
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Erro ao criar ocupação');
    }
  },

  findByRoom: async (roomId: number): Promise<Occupation[]> => {
    try {
      const response = await api.get(`/occupations/room/${roomId}`);
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Erro ao buscar ocupações da sala');
    }
  },

  getCurrentOccupation: async (roomId: number): Promise<Occupation | null> => {
    try {
      const response = await api.get(`/occupations/room/${roomId}/current`);
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Erro ao verificar ocupação atual');
    }
  },

  checkAvailability: async (data: {
    roomId: number;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  }): Promise<boolean> => {
    try {
      const response = await api.post('/occupations/check-availability', data);
      return response.data.available;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Erro ao verificar disponibilidade');
    }
  },

  getOccupiedRooms: async (date: string, time: string): Promise<Occupation[]> => {
    try {
      console.log('Chamando API com:', { date, time });
      const response = await api.get('/occupations/occupied', {
        params: {
          date,
          time
        }
      });
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (err) {
      console.error('Erro completo:', err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Erro ao buscar salas ocupadas');
    }
  }
}; 