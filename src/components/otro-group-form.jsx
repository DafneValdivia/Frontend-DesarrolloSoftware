import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CreateGroupForm.css";

const CreateGroupForm = ({ contactos, onGroupCreate, gruposExistentes }) => {
    const [groupName, setGroupName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Maneja el cambio en el campo de texto y genera las sugerencias
    const handleInputChange = (e) => {
        const value = e.target.value;
        setMemberEmail(value);

        if (value) {
            const filteredSuggestions = contactos.filter((contacto) =>
                (contacto.username.toLowerCase().includes(value.toLowerCase()) ||
                 contacto.mail.toLowerCase().includes(value.toLowerCase())) &&
                !members.some((member) => member.mail === contacto.mail) // Evita duplicados
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // Añade el contacto seleccionado al grupo y limpia las sugerencias
    const handleSelectSuggestion = (suggestion) => {
        setMembers([...members, suggestion]);
        setMemberEmail(""); // Limpia el campo de texto
        setSuggestions([]); // Limpia las sugerencias
    };

    // Agrega un miembro manualmente si el correo o username coincide
    const handleAddMember = () => {
        const selectedContact = contactos.find(
            (contacto) =>
                contacto.mail === memberEmail || contacto.username.toLowerCase() === memberEmail.toLowerCase()
        );

        if (!selectedContact) {
            alert("Este contacto no se encuentra en tu lista de contactos. Por favor, selecciona uno válido.");
            setMemberEmail(""); // Limpia el campo de texto
            setSuggestions([]); // Limpia las sugerencias
            return;
        }

        setMembers([...members, selectedContact]);
        setMemberEmail(""); // Limpia el campo de texto
        setSuggestions([]); // Limpia las sugerencias
    };

    // Maneja la creación del grupo
    const handleCreateGroup = () => {
        if (!groupName) {
            alert("Por favor, ingrese un nombre para el grupo.");
            return;
        }

        // Validar la longitud del nombre del grupo
        if (groupName.length > 20) {
            alert("El nombre del grupo no puede tener más de 20 caracteres. Por favor, elige un nombre más corto.");
            return;
        }

        // Validar si el nombre del grupo ya existe (ignorar mayúsculas y minúsculas)
        const groupExists = gruposExistentes.some(
            (group) => group.toLowerCase() === groupName.toLowerCase()
        );

        if (groupExists) {
            alert("El nombre del grupo ya existe. Por favor, elige otro nombre.");
            return;
        }

        if (members.length === 0) {
            alert("Por favor, ingrese al menos un contacto para el grupo.");
            return;
        }

        // Notifica la creación del grupo al componente padre
        onGroupCreate({ groupName, members });
        setGroupName(""); // Resetea el nombre del grupo
        setMembers([]); // Resetea los miembros
        setMemberEmail(""); // Resetea el email ingresado
    };

    return (
        <div className="create-group-container">
            <h2>CREAR NUEVO GRUPO</h2>
            <input
                type="text"
                placeholder="Nombre del Grupo (máximo 20 caracteres)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={20} // Limita la entrada del usuario a 20 caracteres
            />

            <div className="member-added">
                <h3>Integrantes Añadidos:</h3>
                {members.map((member, index) => (
                    <div className="show-members" key={index}>
                        <button
                            onClick={() => setMembers(members.filter((_, i) => i !== index))}
                            className="X-button"
                        >
                            X
                        </button>
                        <p>
                            {member.username} <span className="suggestion-email">({member.mail})</span>
                        </p>
                    </div>
                ))}
            </div>

            <div id="add-member-div">
                <input
                    type="text"
                    placeholder="Usuario / Mail Integrante"
                    value={memberEmail}
                    onChange={handleInputChange}
                />
                <button id="add-member-button" alt="Agregar" onClick={handleAddMember}>
                    +
                </button>
            </div>

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            className="suggestion-one"
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            <span>{suggestion.username}</span>
                            <br />
                            <span className="suggestion-email">({suggestion.mail})</span>
                        </li>
                    ))}
                </ul>
            )}

            <button id="create-group-button" onClick={handleCreateGroup}>
                Crear Grupo
            </button>
        </div>
    );
};

// Define las propTypes para asegurar que los props sean del tipo correcto
CreateGroupForm.propTypes = {
    contactos: PropTypes.array.isRequired,
    onGroupCreate: PropTypes.func.isRequired,
    gruposExistentes: PropTypes.array.isRequired, // Prop para la lista de grupos existentes
};

export default CreateGroupForm;