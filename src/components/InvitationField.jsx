import React from 'react';
import PropTypes from 'prop-types';
import './InvitationField.css';
import Ticket from "./../assets/ticket.png";
import Cross from "./../assets/cross.png";

const InvitationField = ({ invitations = [], onAccept, onReject }) => {
    // Función para manejar la aceptación de una invitación
    const handleAccept = async (invitation) => {
        /*try {
            const response = await fetch('/api/accept-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId: invitation.groupId }),
            });

            if (response.ok) {
                if (onAccept) onAccept(invitation.groupId);
                alert('Invitación aceptada!');
            } else {
                console.error('Error al aceptar la invitación');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }*/
        // Simulación de aceptación
        if (onAccept) onAccept(invitation.groupId);
        alert('Invitación aceptada!');
    };

    // Función para manejar el rechazo de una invitación
    const handleReject = async (invitation) => {
        /*try {
            const response = await fetch('/api/reject-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId: invitation.groupId }),
            });

            if (response.ok) {
                if (onReject) onReject(invitation.groupId);
                alert('Invitación rechazada');
            } else {
                console.error('Error al rechazar la invitación');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }*/
        // Simulación de rechazo
        if (onReject) onReject(invitation.groupId);
        alert('Invitación rechazada');
    };

    return (
        <div className="invitation-section">
            <h3>Invitaciones</h3>
            {invitations.map((invitation, index) => (
                <div key={index} className="invitation">
                    <p>{invitation.name} desea agregarte al grupo <strong>{`"${invitation.group}"`}</strong></p>
                    <button className="accept" onClick={() => handleAccept(invitation)}>
                        <img src={Ticket} alt="Accept" />
                    </button>
                    <button className="reject" onClick={() => handleReject(invitation)}>
                        <img src={Cross} alt="Reject" />
                    </button>
                </div>
            ))}
            <p className="note">~ No hay más invitaciones ~</p>
        </div>
    );
};

// Definición de los tipos de las props con PropTypes
InvitationField.propTypes = {
    invitations: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            group: PropTypes.string.isRequired,
            groupId: PropTypes.string.isRequired, // Necesario para identificar el grupo
        })
    ),
    onAccept: PropTypes.func, // Callback cuando se acepta la invitación
    onReject: PropTypes.func, // Callback cuando se rechaza la invitación
};

export default InvitationField;
