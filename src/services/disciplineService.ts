import api from './api';

export interface BaseDiscipline {
    id: number;
    name: string;
    code: string;
    description: string;
    area: string;
}

export interface Discipline {
    id: number;
    baseDisciplineId: number;
    professorId: number;
    baseDiscipline?: BaseDiscipline;
}

class DisciplineService {
    async getBaseDisciplines(): Promise<BaseDiscipline[]> {
        const response = await api.get('/base-disciplines');
        return response.data;
    }

    async createBaseDiscipline(data: Omit<BaseDiscipline, 'id'>): Promise<BaseDiscipline> {
        const response = await api.post('/base-disciplines', data);
        return response.data;
    }

    async getProfessorDisciplines(professorId: number): Promise<Discipline[]> {
        const response = await api.get(`/disciplines/professor/${professorId}`);
        return response.data;
    }

    async addDiscipline(professorId: number, baseDisciplineId: number): Promise<Discipline> {
        const response = await api.post('/disciplines', {
            professorId,
            baseDisciplineId
        });
        return response.data;
    }

    async removeDiscipline(id: number): Promise<void> {
        await api.delete(`/disciplines/${id}`);
    }
}

export const disciplineService = new DisciplineService(); 