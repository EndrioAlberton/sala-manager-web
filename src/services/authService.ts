import api from './api';
import { User, LoginCredentials, AuthResponse } from './api';

export const authService = {
    async register(userData: Omit<User, 'id'>): Promise<User> {
        try {
            const response = await api.post<User>('/users/register', userData);
            return response.data;
        } catch (error: any) {
            throw this._handleError(error);
        }
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/users/login', credentials);
            const { token, user } = response.data;
            
            // Armazenar dados do usuário e token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error: any) {
            throw this._handleError(error);
        }
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            // Verifica se o token é válido
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Converte para milissegundos
            return Date.now() < exp;
        } catch {
            return false;
        }
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken(): string | null {
        return localStorage.getItem('token');
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