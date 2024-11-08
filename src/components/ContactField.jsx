import React, { useState } from "react";
import PropTypes from 'prop-types';
import "./ContactField.css";
import AddMember from "./../assets/agregarMember.png";

const ContactField = ({ contactos, onContactoClicked }) => {
    const [clickedContact, setClickedContact] = useState("");
    onContactoClicked(clickedContact);
    

    return (
        <div className="my-contacts-container">
            <h2>MIS CONTACTOS</h2>
            
            {contactos.length > 0 && (
                    <ul className="contactos-list">
                        {contactos.map((contacto, index) => (
                            <li className="contacto-one" key={index} onClick={() => handleSelectSuggestion(contacto)}>
                                <span className="contacto-username">{contacto.username}</span>
                                <br />
                                <span className="contacto-email">({contacto.email})</span>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    );
};

// Define las propTypes para asegurar que los props sean del tipo correcto
ContactField.propTypes = {
    contactos: PropTypes.array.isRequired,
    onContactoClicked: PropTypes.func.isRequired
};

export default ContactField;
