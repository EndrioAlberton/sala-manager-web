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

    const tabs = [
        { id: 'classrooms', label: 'Salas' },
        { id: 'occupations', label: 'Ocupações' },
        { id: 'reports', label: 'Relatórios' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onLogout={handleLogout} />
            
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Bem-vindo ao sistema de gerenciamento de salas</p>
                </div>

                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
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
                    <Card title={activeTab === 'classrooms' ? 'Lista de Salas' : 'Lista de Ocupações'}>
                        <Table
                            columns={activeTab === 'classrooms' 
                                ? [
                                    { key: 'name', label: 'Nome' },
                                    { key: 'capacity', label: 'Capacidade' },
                                    { key: 'type', label: 'Tipo' },
                                    { key: 'status', label: 'Status' }
                                ]
                                : [
                                    { key: 'room', label: 'Sala' },
                                    { key: 'responsible', label: 'Responsável' },
                                    { key: 'start', label: 'Início' },
                                    { key: 'end', label: 'Fim' },
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