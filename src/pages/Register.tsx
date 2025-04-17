import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';

export function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        name: '',
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
            await authService.register(formData);
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Card title="Crie sua conta">
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <Alert message={error} />}

                        <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Nome completo"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Senha"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full"
                            >
                                Registrar
                            </Button>
                        </div>

                        <div className="text-sm text-center">
                            <a
                                href="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Já tem uma conta? Faça login
                            </a>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
} 