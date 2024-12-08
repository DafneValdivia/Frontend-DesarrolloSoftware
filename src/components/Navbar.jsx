import React from 'react';
import './Navbar.css';
import LogoPuduPay from "./../assets/logo.png";
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
    const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

    // Muestra un indicador de carga mientras se verifica la autenticación
    if (isLoading) {
        return (
            <nav className="navbar">
                <div className="logo-out">
                    <div className="logo">
                        <img src={LogoPuduPay} alt="Logo" />
                    </div>
                </div>
                <div className="buttons">
                    <span>Cargando...</span>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <div className="logo-out">
                <div className="logo">
                    <img src={LogoPuduPay} alt="Logo" />
                </div>
            </div>
            <div className="buttons">
                {isAuthenticated && (
                    <>
                        <a className="mis-botones" href="/" >INICIO</a>
                        <a className="mis-botones" href="/mycontacts">MIS CONTACTOS</a>
                        <a className="mis-botones" href="/yourgroups">MIS GRUPOS</a>
                        <a className="mis-botones" href="/profile">MI PERFIL</a>
                    </>
                )}
                <a
                    id="mi-perfil"
                    onClick={() =>
                        isAuthenticated
                            ? logout({ returnTo: window.location.origin })
                            : loginWithRedirect()
                    }
                >
                    {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
