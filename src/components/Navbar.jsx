import React from 'react';
import './Navbar.css';
import LogoPuduPay from "./../assets/logo.png";
import MemberLogo from "./../assets/member.png";
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    return (
        <nav className="navbar">
            <div className="logo-out">
                <div className="logo">
                    <img src={LogoPuduPay} alt="Logo" />
                </div>
            </div>
            <div className="buttons">
                <a className="mis-botones" href="/" >INICIO</a>
                <a className="mis-botones" href="/mycontacts">MIS CONTACTOS</a>
                <a className="mis-botones" href="/yourgroups">MIS GRUPOS</a>
                <a  id="mi-perfil" 
                    href="#perfil"  
                    onClick={() => 
                        isAuthenticated 
                            ? logout({ returnTo: window.location.origin }) 
                            : loginWithRedirect()
                    }
                >
                    <img src={MemberLogo} alt="Icono de perfil" className="profile-icon" />
                    {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
