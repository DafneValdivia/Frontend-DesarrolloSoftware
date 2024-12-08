import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './ProtectedRoute.css';

export default function ProtectedRoute ({ children }) {
    const { isAuthenticated, isLoading } = useAuth0();

    // Muestra un indicador de carga mientras verifica el estado de autenticación
    if (isLoading) {
        return (
            <div className="loading-overlay">
                <div className="loading-content">
                    <span>Cargando...</span>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirige al inicio
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Si está autenticado, renderiza la ruta protegida
    return children;
};
