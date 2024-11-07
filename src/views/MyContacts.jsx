import React from "react";
import Navbar from "../components/Navbar";
import AddContactForm from '../components/AddContactForm';
import ContactField from "../components/ContactField";
import "./MyContacts.css";

const contactosExistentes = [
    { username: "juan", email: "juan@example.com" },
    { username: "maria", email: "maria@example.com" },
    { username: "pedro", email: "pedro@example.com" },
    { username: "ana", email: "ana@example.com" },
    { username: "luisa", email: "luisa@example.com" },
    { username: "carlos", email: "carlos@example.com" }
];

const misContactos = [
    { username: "juan", email: "juan@example.com" },
    { username: "maria", email: "maria@example.com" },
    { username: "carlos", email: "carlos@example.com" }
];


export default function MyContacts() {
    // pedir los contactos existentes al back

    const handleAddContact = (groupData) => {
        console.log("Grupo creado:", groupData);

        // Aquí puedes manejar la lógica de envío al backend o actualización del estado global

    
    };

    const handleContactoClicked = (contactoClicked) => {
        console.log("Contacto Clickeado:", contactoClicked )
        // ver si hacer algo con ese contacto o no
    };

    return (
        <div>
            <Navbar />
            <div className="contacts-page-container">
                <AddContactForm contactos={contactosExistentes} onGroupCreate={handleAddContact} />
                <ContactField contactos={misContactos} onContactoClicked={handleContactoClicked} />
            </div>
        </div>
    );

}