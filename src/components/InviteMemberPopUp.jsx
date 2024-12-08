import React from "react";
import Select from "react-select";
import "./InviteMemberPopUp.css";

const InviteMemberPopUp = ({
    userContacts,
    membersData,
    invitedUserMail,
    setInvitedUserMail,
    sendInvitation,
    closeAddMemberPopup,
}) => {
    // Obtener una lista de correos de los miembros actuales del grupo
    const membersEmails = membersData.map((member) => member.mail);

    // Filtrar los contactos para excluir a los miembros actuales
    const availableContacts = userContacts.filter(
        (contact) => !membersEmails.includes(contact.mail)
    );

    // Convertir los contactos disponibles en opciones para react-select
    const options = availableContacts.map((contact) => ({
        value: contact.mail,
        label: `${contact.username} (${contact.mail})`,
    }));

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Añadir Miembro</h3>
                <Select
                    id="contactSelect"
                    options={options}
                    onChange={(selectedOption) => setInvitedUserMail(selectedOption?.value || "")}
                    placeholder="Escribe o selecciona un contacto"
                    isClearable
                />
                <div className="popup-actions">
                    <button className="button-cancel" onClick={closeAddMemberPopup}>
                        Cancelar
                    </button>
                    <button
                        className="button-submit"
                        onClick={sendInvitation}
                        disabled={!invitedUserMail}
                    >
                        Enviar Invitación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberPopUp;
