import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";
import "./CreateGroupForm.css";

const CreateGroupForm = ({ onGroupCreate, gruposExistentes }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${serverUrl}/contacts/user/${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactos(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    if (isAuthenticated) {
      fetchContactos();
    }
  }, [isAuthenticated, getAccessTokenSilently, user]);

  // Enhanced member addition with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedContact(value);

    if (value) {
      const filteredSuggestions = contactos.filter((contacto) =>
        (contacto.username.toLowerCase().includes(value.toLowerCase()) ||
         contacto.mail.toLowerCase().includes(value.toLowerCase())) &&
        !members.some((member) => member.mail === contacto.mail)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setMembers([...members, suggestion]);
    setSelectedContact(""); 
    setSuggestions([]); 
  };

  const handleAddMember = () => {
    if (!selectedContact) return;

    const contactToAdd = contactos.find(
      (contacto) => 
        contacto.mail === selectedContact || 
        contacto.username.toLowerCase() === selectedContact.toLowerCase()
    );

    if (!contactToAdd) {
      alert("Este contacto no se encuentra en tu lista de contactos. Por favor, selecciona uno válido.");
      setSelectedContact("");
      setSuggestions([]);
      return;
    }

    if (members.some((member) => member.mail === contactToAdd.mail)) {
      alert("Este contacto ya ha sido añadido al grupo.");
      return;
    }

    setMembers([...members, contactToAdd]);
    setSelectedContact("");
    setSuggestions([]);
  };

  const handleRemoveMember = (mailToRemove) => {
    setMembers(members.filter((member) => member.mail !== mailToRemove));
  };

  const handleCreateGroup = async () => {
    // Validate group name length
    if (!groupName) {
      alert("Por favor, ingrese un nombre para el grupo.");
      return;
    }

    if (groupName.length > 20) {
      alert("El nombre del grupo no puede tener más de 20 caracteres. Por favor, elige un nombre más corto.");
      return;
    }

    // Check if group name already exists (case-insensitive)
    const groupExists = gruposExistentes.some(
      (group) => group.toLowerCase() === groupName.toLowerCase()
    );

    if (groupExists) {
      alert("El nombre del grupo ya existe. Por favor, elige otro nombre.");
      return;
    }

    if (members.length === 0) {
      alert("Por favor, añada al menos un integrante al grupo.");
      return;
    }

    const invitedUsers = members.map((member) => member.mail);

    try {
      const token = await getAccessTokenSilently();
      const requestBody = {
        name: groupName,
        total_amount: 0,
        invitedUsers: invitedUsers,
        email: user.email,
      };
      await axios.post(
        `${serverUrl}/groups/create`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Grupo creado exitosamente.");
      onGroupCreate({ groupName, members });
      setGroupName("");
      setMembers([]);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Hubo un error al crear el grupo.");
    }
  };

  return (
    <div className="create-group-container">
      <h2>CREAR NUEVO GRUPO</h2>
      <input
        type="text"
        placeholder="Nombre del Grupo (máximo 20 caracteres)"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        maxLength={20}
        className="input-field"
      />

      <div className="members-list">
        <h3>Integrantes Añadidos:</h3>
        {members.map((member, index) => (
          <div className="member-item" key={index}>
            <span>{member.username} <span className="suggestion-email">({member.mail})</span></span>
            <button
              className="X-button"
              onClick={() => handleRemoveMember(member.mail)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div id="add-member-div">
        <input
          type="text"
          placeholder="Usuario / Mail Integrante"
          value={selectedContact}
          onChange={handleInputChange}
          className="input-field"
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

CreateGroupForm.propTypes = {
  onGroupCreate: PropTypes.func.isRequired,
  gruposExistentes: PropTypes.array.isRequired,
};

export default CreateGroupForm;