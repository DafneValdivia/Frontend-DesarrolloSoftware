// import React from "react";
// import Navbar from "../components/Navbar";
// import AddContactForm from '../components/AddContactForm';
// import ContactField from "../components/ContactField";
// import "./MyContacts.css";
// // Sin conexión
// const contactosExistentes = [
//     { username: "dafne", email: "dafne@example.com" },
//     { username: "mari", email: "mari@example.com" },
//     { username: "cata", email: "cata@example.com" },
//     { username: "alonso", email: "alonso@example.com" },
//     { username: "stefano", email: "stefano@example.com" },
//     { username: "cristobal", email: "cristobal@example.com" }
// ];

// const misContactos = [
//     { username: "juan", email: "juan@example.com" },
//     { username: "maria", email: "maria@example.com" },
//     { username: "carlos", email: "carlos@example.com" },
//     { username: "pepito", email: "pepito@example.com" },
//     { username: "ines", email: "ines@example.com" },
//     { username: "pablo", email: "pablo@example.com" },
//     { username: "antonia", email: "antonia@example.com" }
// ];


// export default function MyContacts() {
//     // pedir los contactos existentes al back

//     const handleAddContact = (groupData) => {
//         console.log("Grupo creado:", groupData);

//         // Aquí puedes manejar la lógica de envío al backend o actualización del estado global


//     };

//     const handleContactoClicked = (contactoClicked) => {
//         console.log("Contacto Clickeado:", contactoClicked )
//         // ver si hacer algo con ese contacto o no
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="contacts-page-container">
//                 <AddContactForm contactos={contactosExistentes} onGroupCreate={handleAddContact} />
//                 <ContactField contactos={misContactos} onContactoClicked={handleContactoClicked} />
//             </div>
//         </div>
//     );

// }

// Con conexion 

import React from "react";
import { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from "../components/Navbar";
import AddContactForm from '../components/AddContactForm';
import ContactField from "../components/ContactField";
import { useAuth0 } from "@auth0/auth0-react"; // Si estás usando Auth0
import "./MyContacts.css";

export default function MyContacts() {
    const { user, isAuthenticated } = useAuth0(); // Obtener el user_id del usuario autenticado
    const [contactosExistentes, setContactosExistentes] = useState([]);
    const [misContactos, setMisContactos] = useState([]);

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const fetchContactos = async () => {
        try {
            // Solicitud para obtener todos los contactos existentes
            const responseExistentes = await axios.get(`${serverUrl}/users/`, {
                withCredentials: true
            });
            setContactosExistentes(responseExistentes.data);
            console.log("Usuarios existentes: ", responseExistentes.data);


            // Solicitud para obtener mis contactos solo si el usuario está autenticado
            if (isAuthenticated && user) {
                const responseMisContactos = await axios.get(`${serverUrl}/contacts/user/${user.email}/`, {
                    withCredentials: true
                });
                setMisContactos(responseMisContactos.data);
            }
        } catch (error) {
            console.error('Error al obtener los contactos:', error);
        }
    };

    useEffect(() => {
        fetchContactos();
    }, [isAuthenticated, user]); // Ejecutar cuando el usuario esté autenticado

    const handleAddContact = async (contactData) => {
        try {
            // Crear el nuevo contacto en el servidor
            await axios.post(
                `${serverUrl}/contacts/create`,
                {
                    user_mail: user.email,
                    contact_mail: contactData.mail
                },
                { withCredentials: true }
            );

            // Actualizar misContactos localmente
            const nuevoContacto = contactData; // Suponiendo que el servidor devuelve el contacto recién creado
            setMisContactos((prevContacts) => [...prevContacts, nuevoContacto]);

            console.log("Contacto creado y agregado:", nuevoContacto);
        } catch (error) {
            console.error("Error al crear el contacto:", error);
        }
    };

    const handleContactoClicked = (contactoClicked) => {
        console.log("Contacto Clickeado:", contactoClicked);
    };

    return (
        <div>
            <Navbar />
            <div className="contacts-page-container">
                <AddContactForm contactos={contactosExistentes}
                    onContactAdded={handleAddContact}
                    onRefresh={fetchContactos} />
                <ContactField contactos={misContactos}
                    onContactoClicked={handleContactoClicked}
                    onRefresh={fetchContactos}
                />
            </div>
        </div>
    );
}