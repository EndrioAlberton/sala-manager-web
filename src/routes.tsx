import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { authService } from './services/authService';

// Componente que verifica autenticação para rotas privadas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    console.log('Verificando autenticação...');
    const isAuthenticated = authService.isAuthenticated();
    console.log('Usuário autenticado?', isAuthenticated);
    
    if (!isAuthenticated) {
        console.log('Usuário não autenticado, redirecionando para login');
        return <Navigate to="/login" replace />;
    }
    
    console.log('Usuário autenticado, carregando rota privada');
    return <>{children}</>;
};

// Componente para a rota raiz que redireciona com base na autenticação
const RootRoute = () => {
    console.log('Verificando autenticação na rota raiz...');
    const isAuthenticated = authService.isAuthenticated();
    console.log('Usuário autenticado na rota raiz?', isAuthenticated);
    
    if (isAuthenticated) {
        console.log('Redirecionando usuário autenticado para /classrooms');
        return <Navigate to="/classrooms" replace />;
    }
    
    console.log('Redirecionando usuário não autenticado para /login');
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
        path: '/dashboard',
        element: <Navigate to="/classrooms" replace />
    }
]); 