import React, { useState } from "react";
import "./CreateGroup.css";

export default function CreateGroup() {

    const [groupName, setGroupName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [members, setMembers] = useState([]);

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
                <h2>Crear Nuevo Grupo</h2>
                <input
                    type="text"
                    placeholder="Nombre del Grupo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="member-input">
                    <input
                    type="email"
                    placeholder="Usuario / Mail Integrante"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <button type="button" onClick={handleAddMember}>
                    + Añadir integrante
                    </button>
                </div>
                <button className="create-group-button" onClick={handleCreateGroup}>
                    Crear Grupo
                </button>
            </div>
        </div>
    )
}