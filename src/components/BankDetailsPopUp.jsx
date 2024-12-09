// components/BankDetailsPopup.jsx
import React from "react";
import PropTypes from "prop-types";
import "./BankDetailsPopUp.css";

const BankDetailsPopup = ({ member, bankDetails, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Datos Bancarios de {member?.username || "Usuario desconocido"}</h3>
                {bankDetails ? (
                    <div>
                        <p><strong>Banco:</strong> {bankDetails.banco}</p>
                        <p><strong>Número de Cuenta:</strong> {bankDetails.numeroDeCuenta}</p>
                        <p><strong>RUT:</strong> {bankDetails.rut}</p>
                        <p><strong>Nombre:</strong> {bankDetails.nombre}</p>
                        <p><strong>Tipo de Cuenta:</strong> {bankDetails.tipoDeCuenta}</p>
                    </div>
                ) : (
                    <p className="no-bank-data">
                        Este miembro no tiene datos bancarios registrados.
                    </p>
                )}
                <button onClick={onClose} className="close-button">Cerrar</button>
            </div>
        </div>
    );
};

BankDetailsPopup.propTypes = {
    member: PropTypes.object,
    bankDetails: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default BankDetailsPopup;
