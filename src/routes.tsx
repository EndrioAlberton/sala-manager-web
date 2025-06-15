import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { UserProfile } from './pages/UserProfile';
import { authService } from './services/authService';

// Componente que verifica autenticação para rotas privadas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
};

// Componente para a rota raiz que redireciona com base na autenticação
const RootRoute = () => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
        return <Navigate to="/classrooms" replace />;
    }
    
    return <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootRoute />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/classrooms',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },
    {
        path: '/profile',
        element: (
            <PrivateRoute>
                <UserProfile />
            </PrivateRoute>
        )
    },
    {
        path: '/dashboard',
        element: <Navigate to="/classrooms" replace />
    }
]); 