import React from 'react';
import './InvitationField.css';

const InvitationField = () => {
    return (
        <div className="notifications-section">
            <h3>Invitaciones</h3>
            <div className="notification">
                <p>Juanito desea agregarte al grupo <strong>"18 en Pucón"</strong></p>
                <button className="accept">✔️</button>
                <button className="reject">❌</button>
            </div>
            <div className="notification">
                <p>Carlos ha pagado su deuda de $1000 pesos, Grupo 22</p>
                <button className="accept">✔️</button>
                <button className="warning">⚠️</button>
            </div>
            <div className="notification">
                <p>Se ha mandado la solicitud de confirmación para el pago realizado a Francisca, grupo "ovejas negras"</p>
            </div>
            <p className="note">- No hay más notificaciones -</p>
        </div>
    );
};

export default InvitationField;
