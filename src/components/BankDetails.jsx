import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './BankDetails.css';

const BankDetails = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [bankDetails, setBankDetails] = useState(null);
    const [editData, setEditData] = useState({
        banco: '',
        numeroDeCuenta: '',
        rut: '',
        nombre: '',
        mail: user.email,
        tipoDeCuenta: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    const banks = [
        'Banco Santander',
        'Banco de Chile',
        'BancoEstado',
        'Scotiabank',
        'BBVA',
        'Itaú',
        'BICE',
        'HSBC',
    ];

    const accountTypes = [
        'Cuenta Corriente',
        'Cuenta Vista',
        'Cuenta de Ahorro',
        'Cuenta RUT',
    ];

    const fetchBankDetails = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${serverUrl}/bankdata/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBankDetails(response.data || null);
            setEditData(response.data || {
                banco: '',
                numeroDeCuenta: '',
                rut: '',
                nombre: '',
                mail: user.email,
                tipoDeCuenta: '',
            });
        } catch (err) {
            setError('No se encontraron datos bancarios');
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        let fieldErrors = { ...errors };

        switch (fieldName) {
            case 'banco':
                if (!value) {
                    fieldErrors.banco = 'Debe seleccionar un banco.';
                } else {
                    delete fieldErrors.banco;
                }
                break;
            case 'numeroDeCuenta':
                if (!value) {
                    fieldErrors.numeroDeCuenta = 'El número de cuenta no puede estar vacío.';
                } else if (!/^\d+$/.test(value)) {
                    fieldErrors.numeroDeCuenta = 'El número de cuenta solo puede contener números.';
                } else {
                    delete fieldErrors.numeroDeCuenta;
                }
                break;
            case 'rut':
                if (!value) {
                    fieldErrors.rut = 'El RUT no puede estar vacío.';
                } else if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$|^\d{7,8}-[\dkK]$/.test(value)) {
                    fieldErrors.rut = 'El formato del RUT no es válido. Recuerde incluir el guión.';
                } else {
                    delete fieldErrors.rut;
                }
                break;
            case 'nombre':
                if (!value) {
                    fieldErrors.nombre = 'El nombre no puede estar vacío.';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    fieldErrors.nombre = 'El nombre solo puede contener letras y espacios.';
                } else {
                    delete fieldErrors.nombre;
                }
                break;
            case 'tipoDeCuenta':
                if (!value) {
                    fieldErrors.tipoDeCuenta = 'Debe seleccionar un tipo de cuenta.';
                } else {
                    delete fieldErrors.tipoDeCuenta;
                }
                break;
            default:
                break;
        }

        setErrors(fieldErrors);
    };

    const validateForm = () => {
        const isEmptyForm = Object.values(editData).every((value) => value === '' || value === user.email);

        if (isEmptyForm) {
            return true;
        }

        Object.keys(editData).forEach((field) => {
            validateField(field, editData[field]);
        });

        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
    
        setError(null); // Limpia cualquier error previo
    
        if (!validateForm()) {
            return;
        }
    
        try {
            const token = await getAccessTokenSilently();
            if (bankDetails) {
                await axios.put(`${serverUrl}/bankdata/${user.email}`, editData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post(`${serverUrl}/bankdata/create/${user.email}`, editData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setBankDetails(editData);
            setIsEditing(false);
            setError(null); // Limpia el mensaje de error en caso de éxito
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al guardar los datos bancarios';
            setError(errorMessage);
        }
    };
    

    const handleEdit = () => {
        setError(null); // Limpia cualquier mensaje de error previo al iniciar edición
        setIsEditing(true);
    };
    
    const handleCancel = () => {
        setEditData(bankDetails || {
            banco: '',
            numeroDeCuenta: '',
            rut: '',
            nombre: '',
            mail: user.email,
            tipoDeCuenta: '',
        });
        setErrors({});
        setError(null); // Limpia el mensaje de error al cancelar
        setIsEditing(false);
    };
    
    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar todos tus datos bancarios?")) {
            try {
                const token = await getAccessTokenSilently();
                await axios.delete(`${serverUrl}/bankdata/${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBankDetails(null);
                setEditData({
                    banco: '',
                    numeroDeCuenta: '',
                    rut: '',
                    nombre: '',
                    mail: user.email,
                    tipoDeCuenta: '',
                });
                setIsEditing(false);
            } catch (err) {
                setError("Error al eliminar los datos bancarios");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página
      };
    

    return (
        <div className="bank-details">
            <h3>Datos Bancarios</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="bank-details-form">
                <label>
                    Banco:
                    <select
                        name="banco"
                        value={editData.banco}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'readonly'}
                    >
                        <option value="">Seleccione un banco</option>
                        {banks.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                    {errors.banco && <div className="error">{errors.banco}</div>}
                </label>
                <label>
                    Número de Cuenta:
                    <input
                        type="text"
                        name="numeroDeCuenta"
                        value={editData.numeroDeCuenta}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'readonly'}
                    />
                    {errors.numeroDeCuenta && <div className="error">{errors.numeroDeCuenta}</div>}
                </label>
                <label>
                    RUT:
                    <input
                        type="text"
                        name="rut"
                        value={editData.rut}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'readonly'}
                    />
                    {errors.rut && <div className="error">{errors.rut}</div>}
                </label>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
                        value={editData.nombre}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'readonly'}
                    />
                    {errors.nombre && <div className="error">{errors.nombre}</div>}
                </label>
                <label>
                    Tipo de Cuenta:
                    <select
                        name="tipoDeCuenta"
                        value={editData.tipoDeCuenta}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'readonly'}
                    >
                        <option value="">Seleccione un tipo de cuenta</option>
                        {accountTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.tipoDeCuenta && <div className="error">{errors.tipoDeCuenta}</div>}
                </label>
                {isEditing ? (
                    <div className="button-group">
                        <button type="submit" onClick={handleSave} className="save-button">Guardar</button>
                        <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>
                    </div>
                ) : (
                    <div className="button-group">
                        <button type="button" onClick={handleEdit} className="edit-button">Editar</button>
                        {bankDetails && (
                            <button 
                                type="button" 
                                onClick={handleDelete} 
                                className="delete-button"
                            >
                                Eliminar Datos Bancarios
                            </button>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default BankDetails;