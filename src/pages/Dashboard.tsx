import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Table } from '../components/Table';

export function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('classrooms');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onLogout={handleLogout} />
            
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Salas</h1>
                    <p className="text-gray-600">Visualize e gerencie as salas disponíveis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Salas Disponíveis">
                        <p className="text-3xl font-bold text-indigo-600">12</p>
                        <p className="text-gray-500">Salas livres no momento</p>
                    </Card>

                    <Card title="Ocupações Hoje">
                        <p className="text-3xl font-bold text-indigo-600">8</p>
                        <p className="text-gray-500">Salas ocupadas hoje</p>
                    </Card>

                    <Card title="Próximas Reservas">
                        <p className="text-3xl font-bold text-indigo-600">5</p>
                        <p className="text-gray-500">Reservas para amanhã</p>
                    </Card>
                </div>

                <div className="mt-8">
                    <Card title="Lista de Salas">
                        <Table
                            columns={[
                                { key: 'name', label: 'Nome' },
                                { key: 'capacity', label: 'Capacidade' },
                                { key: 'type', label: 'Tipo' },
                                { key: 'status', label: 'Status' }
                            ]}
                            data={[]}
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
}