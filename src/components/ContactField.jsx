import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import "./ContactField.css";
import Lapiz from "./../assets/lapiz.png";

const ContactField = ({ contactos }) => {
    const [contactList, setContactList] = useState(contactos);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleRemoveContact = (index) => {
        const updatedContacts = contactList.filter((_, i) => i !== index);
        setContactList(updatedContacts);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleContactClick = (contacto) => {
        // Redirige a la página del contacto específico
        navigate(`/contact/${contacto.id}`);
    };

    return (
        <div className="my-contacts-container">
            <div className="top-field">
                <h2 id="mis-contactos-titulo">MIS CONTACTOS</h2>
                <button id="edit-contact-button" onClick={toggleEditing}>
                    <img src={Lapiz} id="edit-button" alt="Editar contactos" />
                </button>
            </div>
            {contactList.length > 0 ? (
                <ul className="contactos-list">
                    {contactList.map((contacto, index) => (
                        <li 
                            className="contacto-one" 
                            key={index} 
                            onClick={() => handleContactClick(contacto)} 
                        >
                            {isEditing && (
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveContact(index); }} className="X-button">
                                    X
                                </button>
                            )}
                            <span className="contacto-username">{contacto.username}</span>
                            <br />
                            <span className="contacto-email">({contacto.email})</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes contactos en tu lista.</p>
            )}
            {isEditing && (
                <div className="bottom-field">
                    <button onClick={toggleEditing} className="finalizar-button">
                        FINALIZAR
                    </button>
                </div>
            )}
        </div>
    );
};

// Define las propTypes para asegurar que los props sean del tipo correcto
ContactField.propTypes = {
    contactos: PropTypes.array.isRequired
};

export default ContactField;
