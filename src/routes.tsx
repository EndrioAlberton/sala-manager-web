import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { authService } from './services/authService';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const RootRoute = () => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <Navigate to="/classrooms" replace /> : <Navigate to="/login" replace />;
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