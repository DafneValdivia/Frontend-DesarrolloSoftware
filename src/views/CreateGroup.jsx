import React, { useState } from "react";
import "./CreateGroup.css";
import AddMember from "./../assets/agregarMember.png";

export default function CreateGroup() {

    const [groupName, setGroupName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    
    // pedir contactos para poder ir revisandolos

    // Simula una lista de contactos (puedes reemplazarlo con datos reales de tu backend)
    const contactos = [
        { username: "juan", email: "juan@example.com" },
        { username: "maria", email: "maria@example.com" },
        { username: "pedro", email: "pedro@example.com" },
        { username: "ana", email: "ana@example.com" },
        { username: "luisa", email: "luisa@example.com" },
        { username: "carlos", email: "carlos@example.com" }
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMemberEmail(value);

        if (value) {
            const filteredSuggestions = contactos.filter((contacto) => (
                (contacto.username.toLowerCase().includes(value.toLowerCase()) ||
                 contacto.email.toLowerCase().includes(value.toLowerCase()))
            ))

            .filter(contacto => !members.includes(contacto.username) && !members.includes(contacto.email)
        );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // Añade el contacto seleccionado al grupo y limpia las sugerencias
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
        }

        else {
            setMembers([...members, selectedContact]);
        setSuggestions([]);
        }

        setMemberEmail("");
    };

    const handleCreateGroup = () => {
        if (!groupName) {
            alert("Por favor, ingrese un nombre para el grupo");
            return;
        }
        else if(members.length == 0) {
            alert("Por favor, ingrese al menos un contacto para el grupo");
            return;
        }
        else {
            // ver si un grupo puede tener el mismo nombre
            // mandar nombre a back
            console.log("Grupo creado:", groupName, members);
            setMembers([]);
            setMemberEmail("");
            setGroupName("");
            // mandar a back un json con nombre de grupo creado y lista de members
            // recibir una confirmación de que se creó correctamente
            // mostrar notificación en caso de haberse creado correctamente
            // navegar a todos los grupos para poder ver el grupo creado
        }
        
    };

    return (
        <div>
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
                        <div className="show-members">
                            <button onClick={() => setMembers(members.filter((_, i) => i!== index))}
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

                    <button className="add-member-button"><img src={AddMember} onClick={handleAddMember} /></button>
                </div>

                {/* sugerencias para autocompletar */
                suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li className="suggestion-one" key={index} onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                <span>{suggestion.username}</span>
                                <br />
                                <span className="suggestion-email">({suggestion.email})</span>
                            </li>
                        ))}
                    </ul>
                )}

                
                <button id="create-group-button" onClick={handleCreateGroup}>
                    CREAR GRUPO
                </button>
            </div>
        </div>
    )
}