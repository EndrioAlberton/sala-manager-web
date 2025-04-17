import api from './api';
import { User } from './api';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get<User[]>('/users');
            return response.data;
        } catch (error: any) {
            throw this._handleError(error);
        }
    },

    async getUserById(id: number): Promise<User> {
        try {
            const response = await api.get<User>(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            throw this._handleError(error);
        }
    },

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        try {
            const response = await api.put<User>(`/users/${id}`, userData);
            return response.data;
        } catch (error: any) {
            throw this._handleError(error);
        }
    },

    async deleteUser(id: number): Promise<void> {
        try {
            await api.delete(`/users/${id}`);
        } catch (error: any) {
            throw this._handleError(error);
        }
    },

    _handleError(error: any): Error {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    return new Error('Usuário não encontrado');
                case 409:
                    return new Error('Email já está em uso');
                case 400:
                    return new Error('Dados inválidos');
                case 500:
                    return new Error('Erro no servidor');
                default:
                    return new Error('Ocorreu um erro inesperado');
            }
        }
        return new Error('Erro na conexão com o servidor');
    }
}; 