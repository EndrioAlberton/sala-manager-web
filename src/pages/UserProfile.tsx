import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { User } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';

export function UserProfile() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setFormData({
                name: currentUser.name,
                email: currentUser.email
            });
        }
    }, [navigate]);

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
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                throw new Error('Usuário não encontrado');
            }

            await userService.updateUser(currentUser.id, formData);
            // Atualizar dados do usuário no localStorage
            const updatedUser = { ...currentUser, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            navigate('/users');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <Card title="Meu Perfil">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <Alert message={error} />}

                        <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Nome"
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
                            label="Nova Senha (opcional)"
                            value={formData.password || ''}
                            onChange={handleChange}
                        />

                        <div className="flex space-x-4">
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full"
                            >
                                Salvar Alterações
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/users')}
                                className="w-full"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
} 