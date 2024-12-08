import { useState, useEffect } from 'react';
import ProfileInfo from '../components/ProfileInfo';
import InvitationField from '../components/InvitationField';
import './MyProfile.css';
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react";
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
            const response = await axios.get(`${serverUrl}/invitations/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            });

            const formattedData = response.data.map(({ invitation_id, group_id, group_name, invited_by }) => ({
                id: invitation_id,
                group: group_name,
                name: invited_by,
            }));
            setInvitations(formattedData);
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
            const token = await getAccessTokenSilently();
            await axios.put(`${serverUrl}/invitations/${invitationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchInvitations(); // Actualiza las invitaciones
        } catch (error) {
            console.error("Error al aceptar la invitación:", error);
            alert("Hubo un error al aceptar la invitación. Intenta nuevamente.");
        }
    };

    // Función para manejar el rechazo de una invitación
    const handleReject = async (invitationId) => {
        try {
            const token = await getAccessTokenSilently();
            await axios.post(`${serverUrl}/invitations/${invitationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchInvitations(); // Actualiza las invitaciones
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
                <InvitationField invitations={invitations} onAccept={handleAccept} onReject={handleReject} />
            </div>
        </div>
    );
};

export default Profile;
