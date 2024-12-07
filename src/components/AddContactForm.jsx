import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import "./AddContactForm.css";

const AddContactForm = ({ contactos, onContactAdded }) => {
    const [contactList, setContactList] = useState(contactos);
    const [newContactEmail, setNewContactEmail] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewContactEmail(value);

        if (value) {
            const filteredSuggestions = contactList.filter(contacto => 
                contacto.mail.toLowerCase().includes(value.toLowerCase())
            );
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
        const selectedContact = contactList.find(contacto =>
            contacto.mail === newContactEmail
        );
    
        // Verificar si el contacto ya existe en la lista
        const contactAlreadyAdded = contactList.some(contacto => 
            contacto.mail === newContactEmail
        );
    
        if (!selectedContact) {
            alert("Este usuario no existe. Prueba añadir un usuario existente.");
        } else if (contactAlreadyAdded) {
            alert("Este contacto ya se encuentra en tu lista de contactos.");
        } else {
            onContactAdded(selectedContact);
            setSuggestions([]);
        }
    
        setNewContactEmail("");
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

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            className="suggestion-item"
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            {suggestion.mail}
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
    onContactAdded: PropTypes.func.isRequired
};

export default AddContactForm;