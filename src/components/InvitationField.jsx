import React from 'react';
import PropTypes from 'prop-types';
import './InvitationField.css';
import Ticket from "./../assets/ticket.png";
import Cross from "./../assets/cross.png";

const InvitationField = ({ invitations = [], onAccept, onReject }) => {
    return (
        <div className="invitation-section">
            <h3>Invitaciones</h3>
            {invitations.length > 0 ? (
                invitations.map((invitation, index) => (
                    <div key={index} className="invitation">
                        <p>
                            {invitation.name} desea agregarte al grupo <strong>{`"${invitation.group}"`}</strong>
                        </p>
                        <button className="accept" onClick={() => onAccept(invitation.id)}>
                            <img src={Ticket} alt="Aceptar" />
                        </button>
                        <button className="reject" onClick={() => onReject(invitation.id)}>
                            <img src={Cross} alt="Rechazar" />
                        </button>
                    </div>
                ))
            ) : (
                <p className="note">~ No hay más invitaciones ~</p>
            )}
        </div>
    );
};

// Definición de los tipos de las props con PropTypes
InvitationField.propTypes = {
    invitations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired, // El ID único de la invitación
            name: PropTypes.string.isRequired, // El nombre de quien envió la invitación
            group: PropTypes.string.isRequired, // El nombre del grupo
        })
    ),
    onAccept: PropTypes.func.isRequired, // Callback cuando se acepta la invitación
    onReject: PropTypes.func.isRequired, // Callback cuando se rechaza la invitación
};

export default InvitationField;
