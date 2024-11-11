import React, { useState } from "react";
import PropTypes from 'prop-types';
import "./AddContactForm.css";

const AddContactForm = ({ contactos }) => {
    const [newContactEmail, setNewContactEmail] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewContactEmail(value);

        if (value) {
            const filteredSuggestions = contactos.filter(contacto => 
                contacto.email.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setNewContactEmail(suggestion.email);
        setSuggestions([]);
    };

    const handleAddContact = () => {
        const selectedContact = contactos.find(contacto =>
            contacto.email === newContactEmail
        );

        if (!selectedContact) {
            alert("Este contacto no existe. Puedes hacerle una invitación para que se una a esta maravillosa aplicación :D!");
        } else {
            alert("Contacto añadido con éxito"); // Mensaje de confirmación
            window.location.reload(); // Recargar la página después de añadir el contacto
        }

        setNewContactEmail("");
        setSuggestions([]);
    };

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
                            {suggestion.email}
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
    contactos: PropTypes.array.isRequired
};

export default AddContactForm;