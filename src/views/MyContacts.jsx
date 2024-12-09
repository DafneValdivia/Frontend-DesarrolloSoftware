import { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from "../components/Navbar";
import AddContactForm from '../components/AddContactForm';
import ContactField from "../components/ContactField";
import { useAuth0 } from "@auth0/auth0-react";
import "./MyContacts.css";

export default function MyContacts() {
    const { user, isAuthenticated } = useAuth0();
    const [contactosExistentes, setContactosExistentes] = useState([]);
    const [misContactos, setMisContactos] = useState([]);
    const [contactosEliminados, setContactosEliminados] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const fetchContactos = async () => {
        try {
            const token = await getAccessTokenSilently();
            
            // Solicitud para obtener todos los contactos existentes
            const responseExistentes = await axios.get(`${serverUrl}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setContactosExistentes(responseExistentes.data);

            // Solicitud para obtener mis contactos solo si el usuario está autenticado
            if (isAuthenticated && user) {
                const responseMisContactos = await axios.get(`${serverUrl}/contacts/user/${user.email}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setMisContactos(responseMisContactos.data);
            }
        } catch (error) {
            console.error('Error al obtener los contactos:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchContactos();
        }
    }, [isAuthenticated, user]);

    const handleAddContact = async (contactData) => {
        try {
            const token = await getAccessTokenSilently();
            // Crear el nuevo contacto en el servidor
            await axios.post(
                `${serverUrl}/contacts/create`,
                {
                    user_mail: user.email,
                    contact_mail: contactData.mail
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            // Actualizar localmente sin refresh
            const newContact = {
                ...contactData,
                username: contactData.username || contactData.mail.split('@')[0]
            };
            setMisContactos(prevContacts => [...prevContacts, newContact]);
            
            // Eliminar de contactos eliminados si estaba ahí
            setContactosEliminados(prevEliminados => 
                prevEliminados.filter(c => c.mail !== contactData.mail)
            );

        } catch (error) {
            console.error("Error al crear el contacto:", error);
        }
    };

    const handleRemoveContact = async (contactToRemove) => {
        try {
            const token = await getAccessTokenSilently();
            
            // Eliminar en el backend
            await axios.delete(`${serverUrl}/contacts/${user.email}/${contactToRemove.mail}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Actualizar localmente sin refresh
            setMisContactos(prevContacts => 
                prevContacts.filter(contact => contact.mail !== contactToRemove.mail)
            );

            // Añadir a contactos eliminados
            setContactosEliminados(prevEliminados => [...prevEliminados, contactToRemove]);
        } catch (error) {
            console.error("Error al remover el contacto:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="contacts-page-container">
                <AddContactForm 
                    contactos={contactosExistentes}
                    contactosEliminados={contactosEliminados}
                    misContactos={misContactos}
                    onContactAdded={handleAddContact}
                />
                <ContactField 
                    contactos={misContactos}
                    onRemoveContact={handleRemoveContact}
                />
            </div>
        </div>
    );
}