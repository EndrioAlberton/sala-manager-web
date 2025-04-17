import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface HeaderProps {
    onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfile = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    if (!currentUser) {
        return null;
    }

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Sala Manager</h1>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="sr-only">Abrir menu do usuário</span>
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                    {currentUser.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    {currentUser.name}
                                </span>
                            </button>

                            {isOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                    <button
                                        onClick={handleProfile}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Meu Perfil
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 