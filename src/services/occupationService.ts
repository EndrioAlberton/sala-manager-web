import api from './api';

export interface Occupation {
    id: number;
    classroomId: number;
    professorId: number;
    disciplineId: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    classroom?: {
        id: number;
        name: string;
    };
    professor?: {
        id: number;
        name: string;
    };
    discipline?: {
        id: number;
        name: string;
    };
}

export const occupationService = {
    async create(data: {
        classroomId: number;
        professorId: number;
        disciplineId: number;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    }): Promise<Occupation> {
        try {
            const response = await api.post<Occupation>('/occupations', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao criar ocupação');
        }
    },

    async getAll(): Promise<Occupation[]> {
        try {
            const response = await api.get<Occupation[]>('/occupations');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao buscar ocupações');
        }
    },

    async getByClassroom(classroomId: number): Promise<Occupation[]> {
        try {
            const response = await api.get<Occupation[]>(`/occupations/classroom/${classroomId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao buscar ocupações da sala');
        }
    },

    async getByProfessor(professorId: number): Promise<Occupation[]> {
        try {
            const response = await api.get<Occupation[]>(`/occupations/professor/${professorId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao buscar ocupações do professor');
        }
    },

    async getOne(id: number): Promise<Occupation> {
        try {
            const response = await api.get<Occupation>(`/occupations/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao buscar ocupação');
        }
    },

    async update(id: number, data: Partial<Occupation>): Promise<Occupation> {
        try {
            const response = await api.put<Occupation>(`/occupations/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao atualizar ocupação');
        }
    },

    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/occupations/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao excluir ocupação');
        }
    }
}; 