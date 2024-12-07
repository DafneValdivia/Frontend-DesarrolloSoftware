import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './ProfileInfo.css';

const ProfileInfo = () => {
    const { user, isAuthenticated } = useAuth0();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ username: '', phone: '' });

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${user.email}`, {
                    withCredentials: true
                });
                setProfileData(response.data);
                setEditData({ username: response.data.username, phone: response.data.phone });
                setLoading(false);
            } catch (err) {
                setError("Error al obtener la información del perfil");
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfileData();
        }
    }, [isAuthenticated, user]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/profile`, editData, {
                withCredentials: true
            });
            setProfileData({ ...profileData, ...editData });
            setIsEditModalOpen(false);
        } catch (err) {
            setError("Error al actualizar el perfil");
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-info">
            <div className="profile-details">
                <h2>{profileData.username || 'NOMBRE DE USUARIO'}</h2>
                <p><strong>Username:</strong> {profileData.username || 'Username no especificado'}</p>
                <p><strong>Mail:</strong> {profileData.mail || 'MAIL ASOCIADO'}</p>
                <p><strong>Teléfono:</strong> {profileData.phone || 'Número de teléfono no agregado'}</p>
                <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>Editar Perfil</button>
            </div>

            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Perfil</h2>
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                Nombre de Usuario:
                                <input
                                    type="text"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleEditChange}
                                />
                            </label>
                            <label>
                                Teléfono:
                                <input
                                    type="text"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleEditChange}
                                />
                            </label>
                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;
