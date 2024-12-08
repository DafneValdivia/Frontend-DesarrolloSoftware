import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const BankDetails = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [bankDetails, setBankDetails] = useState(null); // Estado para los datos bancarios
    const [editData, setEditData] = useState({ accountNumber: '', bankName: '', accountType: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    // Obtener datos bancarios del backend
    const fetchBankDetails = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${serverUrl}/bankdata/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBankDetails(response.data || null);
            setEditData(response.data || { accountNumber: '', bankName: '', accountType: '' });
            console.log(response.data);
        } catch (err) {
            setError("Error al cargar los datos bancarios");
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            await axios.post(`${serverUrl}/bankdata`, editData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBankDetails(editData); // Actualiza los datos bancarios
            setIsEditing(false);
        } catch (err) {
            setError("Error al guardar los datos bancarios");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditData(bankDetails || { accountNumber: '', bankName: '', accountType: '' });
        setIsEditing(false);
    };

    return (
        <div className="bank-details">
            <h3>Datos Bancarios</h3>
            {error && <p className="error">{error}</p>}
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <label>
                        Número de Cuenta:
                        <input
                            type="text"
                            name="accountNumber"
                            value={editData.accountNumber}
                            onChange={handleEditChange}
                            required
                        />
                    </label>
                    <label>
                        Nombre del Banco:
                        <input
                            type="text"
                            name="bankName"
                            value={editData.bankName}
                            onChange={handleEditChange}
                            required
                        />
                    </label>
                    <label>
                        Tipo de Cuenta:
                        <input
                            type="text"
                            name="accountType"
                            value={editData.accountType}
                            onChange={handleEditChange}
                            required
                        />
                    </label>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={handleCancel}>Cancelar</button>
                </form>
            ) : bankDetails ? (
                <div>
                    <p><strong>Número de Cuenta:</strong> {bankDetails.accountNumber}</p>
                    <p><strong>Nombre del Banco:</strong> {bankDetails.bankName}</p>
                    <p><strong>Tipo de Cuenta:</strong> {bankDetails.accountType}</p>
                    <button onClick={handleEdit}>Editar</button>
                </div>
            ) : (
                <div>
                    <p>No se han agregado datos bancarios.</p>
                    <button onClick={handleEdit}>Agregar Datos</button>
                </div>
            )}
        </div>
    );
};

export default BankDetails;
