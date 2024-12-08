import React, { useState, useEffect } from 'react';
import ProfileInfo from '../components/ProfileInfo';
import InvitationField from '../components/InvitationField';
import './MyProfile.css';
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react"; // Si estás usando Auth0
import axios from 'axios';

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [invitations, setInvitations] = useState([]);
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    // Función para cargar las invitaciones desde el backend
    const fetchInvitations = async () => {
        try {
            const token = await getAccessTokenSilently();
            const email = user.email;

            // Realizar el llamado al backend para obtener las invitaciones
            const response = await axios.get(`${serverUrl}/invitations/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                },
            });

            // Formatear los datos obtenidos para el componente de invitaciones
            const formattedData = response.data.map(({ invitation_id, group_id, group_name, invited_by }) => ({
                id: invitation_id, // ID único de la invitación
                group: group_name, // Nombre del grupo
                name: invited_by,  // Nombre de quien envió la invitación
            }));

            setInvitations(formattedData); // Guardar las invitaciones en el estado
            console.log("Invitaciones almacenadas:", formattedData);
        } catch (error) {
            console.error('Error al obtener invitaciones:', error);
            alert("Hubo un error al cargar las invitaciones. Por favor, intenta nuevamente.");
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchInvitations();
        }
    }, [isAuthenticated, user]);

    // Función para manejar la aceptación de una invitación
    const handleAccept = async (invitationId) => {
        try {
            console.log(`Aceptando invitación con ID: ${invitationId}`);
            const token = await getAccessTokenSilently();

            // Realizar el PUT al endpoint para aceptar la invitación
            const response = await axios.put(`${serverUrl}/invitations/${invitationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token
                },
            });

            if (response.status === 200) {
                alert('Invitación aceptada!');
                fetchInvitations(); // Actualiza las invitaciones después de aceptar
            } else {
                console.error('Error al aceptar la invitación:', response.data);
                alert('Hubo un error al aceptar la invitación. Inténtalo nuevamente.');
            }
        } catch (error) {
            console.error("Error al aceptar la invitación:", error);
            alert("Hubo un error al aceptar la invitación. Intenta nuevamente.");
        }
    };

    // Función para manejar el rechazo de una invitación
    const handleReject = async (invitationId) => {
        try {
            console.log(`Rechazando invitación con ID: ${invitationId}`);
            const token = await getAccessTokenSilently();

            // Realizar el POST al endpoint para rechazar la invitación
            const response = await axios.post(`${serverUrl}/invitations/${invitationId}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token
                },
            });

            if (response.status === 200) {
                alert('Invitación rechazada!');
                fetchInvitations(); // Actualiza las invitaciones después de rechazar
            } else {
                console.error('Error al rechazar la invitación:', response.data);
                alert('Hubo un error al rechazar la invitación. Inténtalo nuevamente.');
            }
        } catch (error) {
            console.error("Error al rechazar la invitación:", error);
            alert("Hubo un error al rechazar la invitación. Intenta nuevamente.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <ProfileInfo />
                <InvitationField
                    invitations={invitations}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            </div>
        </div>
    );
};

export default Profile;
