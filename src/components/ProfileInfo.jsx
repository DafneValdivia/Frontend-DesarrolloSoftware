import React from 'react';
import './ProfileInfo.css';

const ProfileInfo = () => {
    return (
        <div className="profile-info">
            <div className="profile-avatar">N</div>
            <div className="profile-details">
                <h2>NOMBRE DE USUARIO</h2>
                <p>MAIL ASOCIADO</p>
                <p><strong>Nombre Completo</strong> <a href="#">EDITAR</a></p>
                <p>12.345.678-9</p>
                <p>Cuenta Corriente: 00-123-4567-89</p>
                <p>Banco de Chile</p>
                <p>nombre.personal@gmail.com</p>
            </div>
        </div>
    );
};

export default ProfileInfo;
