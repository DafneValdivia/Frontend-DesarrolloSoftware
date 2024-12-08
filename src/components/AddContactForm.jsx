import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import "./AddContactForm.css";

const AddContactForm = ({ 
    contactos, 
    contactosEliminados, 
    onContactAdded, 
    misContactos 
}) => {
    const [contactList, setContactList] = useState(contactos);
    const [newContactEmail, setNewContactEmail] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewContactEmail(value);
        setError(""); // Clear any previous errors

        if (value) {
            // Combinar sugerencias de contactos existentes y contactos eliminados
            const filteredSuggestions = [
                ...contactos.filter(contacto => 
                    contacto.mail.toLowerCase().includes(value.toLowerCase()) &&
                    !misContactos.some(existingContact => existingContact.mail === contacto.mail)
                ),
                ...contactosEliminados.filter(contacto => 
                    contacto.mail.toLowerCase().includes(value.toLowerCase())
                )
            ];

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setNewContactEmail(suggestion.mail);
        setSuggestions([]);
    };

    const handleAddContact = () => {
        // Check if the contact is already in the user's contact list
        const isAlreadyContact = misContactos.some(
            contact => contact.mail === newContactEmail
        );

        if (isAlreadyContact) {
            setError("Este contacto ya está en tu lista.");
            return;
        }

        // Buscar en contactos existentes o eliminados
        const selectedContact = 
            contactos.find(contacto => contacto.mail === newContactEmail) ||
            contactosEliminados.find(contacto => contacto.mail === newContactEmail);

        if (!selectedContact) {
            setError("Este contacto no existe.");
        } else {
            onContactAdded(selectedContact);
            setSuggestions([]);
            setNewContactEmail("");
        }
    };

    useEffect(() => {
        setContactList(contactos);
    }, [contactos]);

    return (
        <div className="create-group-container">
            <h2>Agregar Nuevo Contacto</h2>
            
            <div id="add-member-div">
                <input
                    type="email"
                    placeholder="Correo electrónico del nuevo contacto"
                    value={newContactEmail}
                    onChange={handleInputChange}
                    className="contact-input"
                />
            </div>

            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`suggestion-item ${
                                contactosEliminados.some(c => c.mail === suggestion.mail) 
                                    ? 'recently-removed' 
                                    : ''
                            }`}
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            {suggestion.mail}
                            {contactosEliminados.some(c => c.mail === suggestion.mail) && (
                                <span className="recently-removed-tag">Eliminado recientemente</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <button id="create-group-button" onClick={handleAddContact}>
                Añadir
            </button>
        </div>
    );
};

// Define las propTypes para asegurar que los props sean del tipo correcto
AddContactForm.propTypes = {
    contactos: PropTypes.array.isRequired,
    contactosEliminados: PropTypes.array.isRequired,
    onContactAdded: PropTypes.func.isRequired,
    misContactos: PropTypes.array.isRequired
};

export default AddContactForm;