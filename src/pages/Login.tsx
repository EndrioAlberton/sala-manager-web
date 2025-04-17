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

        try {
            await authService.login(formData);
            navigate('/classrooms');
        } catch (err: any) {
            setError(err.message);
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
                    </form>
                </Card>
            </div>
        </div>
    );
} 