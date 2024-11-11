import React, { useState, useEffect } from 'react';
import ProfileInfo from '../components/ProfileInfo';
import InvitationField from '../components/InvitationField';
import './MyProfile.css';
import Navbar from '../components/Navbar';

const Profile = () => {

    const [invitations, setInvitations] = useState([
        { name: 'Juanito', group: '18 en Pucón', groupId: '1' },
        { name: 'Maria', group: 'Viaje a la playa', groupId: '2' },
        { name: 'Juanito', group: '18 en Pucón', groupId: '3' },
        { name: 'Carlos', group: 'Grupo de Amigos', groupId: '4' },
        { name: 'María', group: 'Familia', groupId: '5' },
    ]);

    // Función para manejar la aceptación de una invitación
    const handleAccept = (groupId) => {
        setInvitations(invitations.filter(invitation => invitation.groupId !== groupId));
    };

    // Función para manejar el rechazo de una invitación
    const handleReject = (groupId) => {
        setInvitations(invitations.filter(invitation => invitation.groupId !== groupId));
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <ProfileInfo />
                <InvitationField invitations={invitations} onAccept={handleAccept} onReject={handleReject}  />
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
