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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header onLogout={handleLogout} />
            
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Salas</h1>
                    <p className="text-gray-600 mt-2">Visualize e gerencie as salas disponíveis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="glass-effect shadow-soft hover-scale">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Salas Disponíveis</h3>
                            <p className="text-4xl font-bold text-indigo-600">12</p>
                            <p className="text-gray-500 mt-2">Salas livres no momento</p>
                        </div>
                    </Card>

                    <Card className="glass-effect shadow-soft hover-scale">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ocupações Hoje</h3>
                            <p className="text-4xl font-bold text-indigo-600">8</p>
                            <p className="text-gray-500 mt-2">Salas ocupadas hoje</p>
                        </div>
                    </Card>

                    <Card className="glass-effect shadow-soft hover-scale">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximas Reservas</h3>
                            <p className="text-4xl font-bold text-indigo-600">5</p>
                            <p className="text-gray-500 mt-2">Reservas para amanhã</p>
                        </div>
                    </Card>
                </div>

                <div className="animate-fade-in">
                    <Card className="glass-effect shadow-soft">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Salas</h2>
                            <Table
                                columns={[
                                    { key: 'name', label: 'Nome' },
                                    { key: 'capacity', label: 'Capacidade' },
                                    { key: 'type', label: 'Tipo' },
                                    { key: 'status', label: 'Status' }
                                ]}
                                data={[]}
                            />
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}