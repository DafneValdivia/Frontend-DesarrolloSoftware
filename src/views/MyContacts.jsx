import React from "react";
import Navbar from "../components/Navbar";
import AddContactForm from '../components/AddContactForm';
import ContactField from "../components/ContactField";
import "./MyContacts.css";

const contactosExistentes = [
    { username: "dafne", email: "dafne@example.com" },
    { username: "mari", email: "mari@example.com" },
    { username: "cata", email: "cata@example.com" },
    { username: "alonso", email: "alonso@example.com" },
    { username: "stefano", email: "stefano@example.com" },
    { username: "cristobal", email: "cristobal@example.com" }
];

const misContactos = [
    { username: "juan", email: "juan@example.com" },
    { username: "maria", email: "maria@example.com" },
    { username: "carlos", email: "carlos@example.com" },
    { username: "pepito", email: "pepito@example.com" },
    { username: "ines", email: "ines@example.com" },
    { username: "pablo", email: "pablo@example.com" },
    { username: "antonia", email: "antonia@example.com" }
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