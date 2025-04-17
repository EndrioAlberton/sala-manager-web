import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { User } from '../services/api';
import { authService } from '../services/authService';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Table } from '../components/Table';

export function UsersList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        loadUsers();
    }, [navigate]);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user: User) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        try {
            await userService.deleteUser(user.id);
            setUsers(users.filter(u => u.id !== user.id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const columns = [
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'Email' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Lista de Usuários</h1>
                        <div className="space-x-4">
                            <Button
                                onClick={() => navigate('/profile')}
                                variant="primary"
                            >
                                Meu Perfil
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="danger"
                            >
                                Sair
                            </Button>
                        </div>
                    </div>

                    {error && <Alert message={error} />}

                    <Table
                        columns={columns}
                        data={users}
                        onEdit={(user) => navigate(`/users/${user.id}`)}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
} 