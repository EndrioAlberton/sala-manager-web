import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { LoginCredentials } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validação básica
        if (!formData.email) {
            setError('Por favor, informe seu e-mail');
            setLoading(false);
            return;
        }

        if (!formData.password) {
            setError('Por favor, informe sua senha');
            setLoading(false);
            return;
        }

        try {
            console.log('Tentando login com:', { email: formData.email });
            const response = await authService.login(formData);
            console.log('Login bem-sucedido, token:', response.token.substring(0, 10) + '...');
            
            // Verificar se está autenticado antes de redirecionar
            if (authService.isAuthenticated()) {
                console.log('Usuário autenticado, redirecionando...');
                navigate('/classrooms', { replace: true });
            } else {
                console.log('Falha na autenticação após login.');
                setError('Erro de autenticação. Tente novamente.');
            }
        } catch (err: any) {
            console.error('Erro durante login:', err);
            setError(err.message || 'Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sala Manager</h1>
                    <p className="text-gray-600">Gerencie suas salas de forma eficiente</p>
                </div>

                <Card className="glass-effect shadow-soft animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo</h2>
                        <p className="text-gray-600 mt-2">Faça login para continuar</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <Alert message={error} />}
                        
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="hover-scale"
                            placeholder="Seu e-mail"
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Senha"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="hover-scale"
                            placeholder="Sua senha"
                        />

                        <div>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Entrar
                            </Button>
                        </div>

                        <div className="text-center">
                            <a
                                href="/register"
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Não tem uma conta? Registre-se
                            </a>
                        </div>
                        
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        await authService.register({
                                            name: "Usuário Teste",
                                            email: "teste@example.com",
                                            password: "senha123"
                                        });
                                        setFormData({
                                            email: "teste@example.com",
                                            password: "senha123"
                                        });
                                        setError("Usuário de teste criado! Tente fazer login agora.");
                                    } catch (err: any) {
                                        setError("Erro ao criar usuário de teste: " + err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Criar usuário de teste
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
} 