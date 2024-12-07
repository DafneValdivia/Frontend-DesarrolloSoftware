import React, { useState, useEffect } from 'react';
import ProfileInfo from '../components/ProfileInfo';
import InvitationField from '../components/InvitationField';
import './MyProfile.css';
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react"; // Si estás usando Auth0
import axios from 'axios';

const Profile = () => {


    const { user, isAuthenticated } = useAuth0(); // Obtener el user_id del usuario autenticado
    const [invitations, setInvitations] = useState([]);
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const { getAccessTokenSilently } = useAuth0();

    console.log(user);

    //Función para cargar las invitaciones desde el backend
    const fetchInvitations = async () => {
        try {
            const token = await getAccessTokenSilently();
            const email = user.email;
            const response = await axios.get(`${serverUrl}/invitations/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                }
            });
            console.log(response.data);
            const formattedData = response.data.map(({ group_id, group_name, invited_by }) => ({
                id: group_id,
                group: group_name,
                name: invited_by
            }));
            console.log(formattedData);
            setInvitations(formattedData);
            if (response.ok) {
                const data = await response.json();
                setInvitations(data);
            } else {
                console.error('Error al obtener invitaciones');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, [isAuthenticated, user]);

    //Función para manejar la aceptación de una invitación
    const handleAccept = async (invitationId) => {
        await fetch(`${serverUrl}/invitations/${invitationId}`, { method: 'PUT' });
        fetchInvitations();
    };

    //Función para manejar el rechazo de una invitación
    const handleReject = async (invitationId) => {
        await fetch(`${serverUrl}/invitations/${invitationId}`, { method: 'POST' });
        fetchInvitations();
    }

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

/*
const [invitations, setInvitations] = useState([]);

// Función para cargar las invitaciones desde el backend
const fetchInvitations = async () => {
    try {
        const response = await fetch('/api/get-invitations');
        if (response.ok) {
            const data = await response.json();
            setInvitations(data);
        } else {
            console.error('Error al obtener invitaciones');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};

useEffect(() => {
    fetchInvitations();
}, []);

// Función para manejar la aceptación de una invitación
const handleAccept = async (groupId) => {
    await fetch(`/api/accept-invitation`, { method: 'POST', body: JSON.stringify({ groupId }) });
    fetchInvitations();
};

// Función para manejar el rechazo de una invitación
const handleReject = async (groupId) => {
    await fetch(`/api/reject-invitation`, { method: 'POST', body: JSON.stringify({ groupId }) });
    fetchInvitations(); 
*/
