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
            console.log('Tentando login com:', { email: credentials.email, senha: '******' });
            
            // Garantir que estamos enviando email e senha
            if (!credentials.email || !credentials.password) {
                throw new Error('E-mail e senha são obrigatórios');
            }
            
            console.log('Enviando requisição para /users/login');
            
            // Usar diretamente o axios para evitar problemas com interceptors
            const response = await api.post<AuthResponse>('/users/login', {
                email: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Resposta recebida:', { status: response.status, temToken: !!response.data.token });
            
            const { token, user } = response.data;
            
            // Armazenar dados do usuário e token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('Login bem-sucedido!');
            return response.data;
        } catch (error: any) {
            console.log('Erro no login:', error);
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
        console.log('Erro completo:', error);
        
        if (error.response) {
            console.log('Resposta do servidor:', error.response.data);
            console.log('Status:', error.response.status);
            
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
            console.log('Sem resposta do servidor:', error.request);
            return new Error('Sem resposta do servidor. Verifique sua conexão.');
        }
        
        console.log('Erro de configuração:', error.message);
        return new Error(`Erro na conexão: ${error.message}`);
    }
}; 