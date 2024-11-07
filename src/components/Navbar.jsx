import React from 'react';
import './Navbar.css';
import LogoPuduPay from "./../assets/logo.png";
import MemberLogo from "./../assets/member.png";

const Navbar = () => {
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
                <a id="mi-perfil" href="#perfil">
                <img src={MemberLogo} alt="Icono de perfil" className="profile-icon" />
                MI PERFIL</a>
            </div>
        </nav>
    );
};

export default Navbar;
