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
    baseDiscipline: BaseDiscipline;
}

class DisciplineService {
    async getProfessorDisciplines(professorId: number): Promise<Discipline[]> {
        try {
            const response = await api.get(`/disciplines/professor/${professorId}`);
            return response.data;
        } catch (error: any) {
            console.error('Erro ao carregar disciplinas do professor:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Erro ao carregar disciplinas do professor');
        }
    }

    async getBaseDisciplines(): Promise<BaseDiscipline[]> {
        try {
            const response = await api.get('/base-disciplines');
            return response.data;
        } catch (error: any) {
            console.error('Erro ao carregar disciplinas base:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Erro ao carregar disciplinas base');
        }
    }

    async addDiscipline(professorId: number, baseDisciplineId: number): Promise<Discipline> {
        try {
            const response = await api.post('/disciplines', { professorId, baseDisciplineId });
            return response.data;
        } catch (error: any) {
            console.error('Erro ao adicionar disciplina:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Erro ao adicionar disciplina');
        }
    }

    async removeDiscipline(disciplineId: number): Promise<void> {
        try {
            await api.delete(`/disciplines/${disciplineId}`);
        } catch (error: any) {
            console.error('Erro ao remover disciplina:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Erro ao remover disciplina');
        }
    }
}

export const disciplineService = new DisciplineService(); 