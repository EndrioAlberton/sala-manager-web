import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { authService } from './services/authService';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
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
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }
]); 