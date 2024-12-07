import React, { useState, useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import "./ContactField.css";
import Lapiz from "./../assets/lapiz.png";
import { useAuth0 } from "@auth0/auth0-react"; // Si estás usando Auth0

const ContactField = ({ contactos }) => {
    const [contactList, setContactList] = useState(contactos);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0(); // Obtener el user_id del usuario autenticado
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    // Sincroniza contactList con contactos cada vez que contactos cambie
    useEffect(() => {
        setContactList(contactos);
    }, [contactos]);

    const handleRemoveContact = async (index, mail_contacto) => {
        try {
            // Crear una nueva lista sin el contacto eliminado
            const updatedContacts = contactList.filter((_, i) => i !== index);
            setContactList(updatedContacts);
            const token = await getAccessTokenSilently();
            await axios.delete(`${serverUrl}/contacts/${user.email}/${mail_contacto}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            });
            // Aquí podrías enviar la lista actualizada al componente padre si es necesario
        } catch (error) {
            console.error("Error al remover el contacto:", error);
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    // const handleContactClick = (contacto) => {
    //     navigate(`/contact/${contacto.id}`);
    // };

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
                        // onClick={() => handleContactClick(contacto)}
                        >
                            {isEditing && (
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveContact(index, contacto.mail); }} className="X-button">
                                    X
                                </button>
                            )}
                            <span className="contacto-username">{contacto.username}</span>
                            <br />
                            <span className="contacto-email">({contacto.mail})</span>
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
