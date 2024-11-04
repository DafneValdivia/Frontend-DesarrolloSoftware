import React, { useState } from "react";
import "./CreateGroup.css";
import AddMember from "./../assets/agregarMember.png";

export default function CreateGroup() {

    const [groupName, setGroupName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [members, setMembers] = useState([]);
    // pedir contactos para poder ir revisandolos

    const handleAddMember = () => { // aca sería bueno poder confirmar el nombre de usuario o correo a medida que se va escribiendo
        if (memberEmail) {
        setMembers([...members, memberEmail]);
        setMemberEmail("");
        }
    };

    const handleCreateGroup = () => {
        // Aquí puedes manejar la lógica para crear el grupo
        console.log("Grupo creado:", groupName, members);
        // mandar a back un json con nombre de grupo creado y lista de members
        // recibir una confirmación de que se creó correctamente
        // mostrar notificación en caso de haberse creado correctamente
        // navegar a todos los grupos para poder ver el grupo creado
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
                <input
                type="email"
                placeholder="Usuario / Mail Integrante"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                />
                <div id="add-member-div">
                    <p>Añadir Integrante</p>
                    <button className="add-member-button"><img src={AddMember} onClick={handleAddMember} /></button>
                </div>
                <div className="member-added">

                </div>
                <button id="create-group-button" onClick={handleCreateGroup}>
                    CREAR GRUPO
                </button>
            </div>
        </div>
    )
}