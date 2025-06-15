import api from './api';
import { User, LoginCredentials, AuthResponse } from './api';
import { UserType } from '../types/User';

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
            
            // Garantir que estamos enviando email e senha
            if (!credentials.email || !credentials.password) {
                throw new Error('E-mail e senha são obrigatórios');
            }
                        
            // Usar diretamente o axios para evitar problemas com interceptors
            const response = await api.post<AuthResponse>('/users/login', {
                email: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
                        
            const { token, user } = response.data;
            
            // Armazenar dados do usuário e token
            localStorage.removeItem('token'); // Limpar antes para garantir
            localStorage.removeItem('user');
            
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
        
        if (!token) {
            return false;
        }
        
        // Para sistemas simples, só verificamos se existe um token
        // Em produção, você verificaria a validade do JWT
        return true;
    },

    getCurrentUser(): User | null {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        
        try {
            const user = JSON.parse(userString);
            // Converter userType para o enum correto
            return {
                ...user,
                userType: user.userType as UserType
            };
        } catch {
            return null;
        }
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isProfessor(): boolean {
        const user = this.getCurrentUser();
        return user?.userType?.toLowerCase() === UserType.PROFESSOR.toLowerCase();
    },

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.userType?.toLowerCase() === UserType.ADMIN.toLowerCase();
    },

    _handleError(error: any): Error {
        
        if (error.response) {
            
            // Mensagens de erro específicas da API
            if (error.response.data && error.response.data.message) {
                return new Error(error.response.data.message);
            }
            
            // Tratamento por status HTTP
            switch (error.response.status) {
                case 404:
                    return new Error('Usuário não encontrado ou credenciais inválidas');
                case 409:
                    return new Error('Email já está em uso');
                case 400:
                    return new Error('Dados inválidos');
                case 401:
                    return new Error('Credenciais inválidas');
                case 403:
                    return new Error('Acesso não autorizado');
                case 500:
                    return new Error('Erro no servidor');
                default:
                    return new Error(`Erro inesperado (${error.response.status})`);
            }
        } else if (error.request) {
            return new Error('Sem resposta do servidor. Verifique sua conexão.');
        }
        
        return new Error(`Erro na conexão: ${error.message}`);
    }
}; 