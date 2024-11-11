import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useAuth0 } from "@auth0/auth0-react";
import "./CreateGroupForm.css";
import axios from 'axios';

const CreateGroupForm = ({ contactos, onGroupCreate }) => {
    const { user, isAuthenticated } = useAuth0();
    const [groupName, setGroupName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Obtén el userId del objeto de usuario de Auth0 si el usuario está autenticado
    const userId = isAuthenticated ? user.sub : null;

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMemberEmail(value);

        if (value) {
            const filteredSuggestions = contactos.filter((contacto) => 
                (contacto.username.toLowerCase().includes(value.toLowerCase()) ||
                 contacto.email.toLowerCase().includes(value.toLowerCase())) &&
                !members.some(member => member.email === contacto.email)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setMemberEmail(suggestion.email);
        setSuggestions([]);
    };

    const handleAddMember = () => {
        const selectedContact = contactos.find(contacto =>
            contacto.email === memberEmail || contacto.username === memberEmail
        );

        if (!selectedContact) {
            alert("Este contacto no se encuentra en tu lista de contactos. Te invito a agregarlo a tus amigos!");
        } else {
            setMembers([...members, selectedContact]);
            setSuggestions([]);
        }

        setMemberEmail("");
    };

    const handleCreateGroup = async () => {
        if (!groupName) {
            alert("Por favor, ingrese un nombre para el grupo");
            return;
        } else if (members.length === 0) {
            alert("Por favor, ingrese al menos un contacto para el grupo");
            return;
        } else if (!userId) {
            alert("No se pudo obtener el ID del usuario. Intente iniciar sesión nuevamente.");
            return;
        } else {
            const groupData = {
                creatorId: userId, // Envía el ID del usuario autenticado como el creador
                groupName,
                members: members.map(member => ({ username: member.username, email: member.email }))
            };

            try {
                const response = await axios.post('/api/groups', groupData);

                alert('Grupo creado exitosamente');
                onGroupCreate(response.data);
                setMembers([]);
                setMemberEmail("");
                setGroupName("");
            } catch (error) {
                console.error('Error al crear el grupo:', error);
                alert('Hubo un error al crear el grupo');
            }
        }
    };

    return (
        <div className="create-group-container">
            <h2>CREAR NUEVO GRUPO</h2>
            <input
                type="text"
                placeholder="Nombre del Grupo"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />

            <div className="member-added">
                <h3>Integrantes Añadidos:</h3>
                {members.map((member, index) => (
                    <div className="show-members" key={index}>
                        <button onClick={() => setMembers(members.filter((_, i) => i !== index))}
                            className="X-button">
                            X
                        </button>
                        <p>{member.username} <span className="suggestion-email">({member.email})</span></p>
                    </div>
                ))}
            </div>

            <div id="add-member-div">
                <input
                    type="email"
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
                        <li className="suggestion-one" key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                            <span>{suggestion.username}</span>
                            <br />
                            <span className="suggestion-email">({suggestion.email})</span>
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
    onGroupCreate: PropTypes.func.isRequired
};

export default CreateGroupForm;
