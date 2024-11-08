import React from "react";
import Navbar from "../components/Navbar";
import CreateGroupForm from '../components/CreateGroupForm';

const contactos = [
    { username: "juan", email: "juan@example.com" },
    { username: "maria", email: "maria@example.com" },
    { username: "pedro", email: "pedro@example.com" },
    { username: "ana", email: "ana@example.com" },
    { username: "luisa", email: "luisa@example.com" },
    { username: "carlos", email: "carlos@example.com" }
];

export default function CreateGroup() {
    const handleGroupCreation = (groupData) => {
        console.log("Grupo creado:", groupData);
        // Aquí puedes manejar la lógica de envío al backend o actualización del estado global

    
    };

    return (
        <div>
            <Navbar />
            <CreateGroupForm contactos={contactos} onGroupCreate={handleGroupCreation} />
        </div>
    );

}