import React, { useEffect, useState } from "react";
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
    const userId = isAuthenticated ? user.sub : null;

    const fetchContactos = async () => {
        try {
            // Solicitud para obtener todos los contactos existentes
            const responseExistentes = await axios.get(`${serverUrl}/users/`, {
                withCredentials: true});
            setContactosExistentes(responseExistentes.data);
            console.log(responseExistentes);


            // Solicitud para obtener mis contactos solo si el usuario está autenticado
            if (isAuthenticated && user) {
                const responseMisContactos = await axios.get(`${serverUrl}/contacts/user/${userId}/`, {
                    withCredentials: true});
                setMisContactos([responseMisContactos.data]);
            }
        } catch (error) {
            console.error('Error al obtener los contactos:', error);
        }
    };

    useEffect(() => {
        fetchContactos();
    }, [isAuthenticated, user]); // Ejecutar cuando el usuario esté autenticado

    const handleAddContact = (groupData) => {
        console.log("Grupo creado:", groupData);
    };

    const handleContactoClicked = (contactoClicked) => {
        console.log("Contacto Clickeado:", contactoClicked);
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