import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './ProfileInfo.css';

const ProfileInfo = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ username: '', phone: '' });
    const [formErrors, setFormErrors] = useState({});
    const [originalData, setOriginalData] = useState({ username: '', phone: '' });

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user || !user.email) return;

            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setProfileData(response.data);
                setEditData({ username: response.data.username, phone: response.data.phone });
                setOriginalData({ username: response.data.username, phone: response.data.phone });
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

    const validateForm = () => {
        const errors = {};

        if (!editData.username.trim()) {
            errors.username = "El nombre de usuario no puede estar vacío.";
        } else if (!/[a-zA-Z]/.test(editData.username)) {
            errors.username = "El nombre de usuario debe incluir al menos una letra.";
        }

        const phoneRegex = /^[0-9]*$/;
        if (!editData.phone.trim()) {
            errors.phone = "El número de teléfono no puede estar vacío.";
        } else if (!phoneRegex.test(editData.phone)) {
            errors.phone = "El número de teléfono solo puede contener números.";
        } else if (editData.phone.length < 7 || editData.phone.length > 15) {
            errors.phone = "El número de teléfono debe tener entre 7 y 15 dígitos.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const token = await getAccessTokenSilently();
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/profile`, editData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setProfileData({ ...profileData, ...editData });
            setOriginalData({ ...editData });
            setIsEditModalOpen(false);
        } catch (err) {
            setError("Error al actualizar el perfil");
        }
    };

    const handleCancelEdit = () => {
        setEditData({ ...originalData }); // Restablece los campos de texto a los valores originales
        setFormErrors({}); // Limpia los mensajes de error
        setIsEditModalOpen(false); // Cierra el modal
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
                                {formErrors.username && <div className="error-message">{formErrors.username}</div>}
                            </label>
                            <label>
                                Teléfono:
                                <input
                                    type="text"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleEditChange}
                                />
                                {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                            </label>
                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={handleCancelEdit}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;
