import React, { useState } from 'react';
import './PopUp.css';
import '../App.css'
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react"; // Si estás usando Auth0

export default function Popup({ onClose, groupId }) {
  const [titulo, setTitulo] = useState("");
  const [amount, setAmount] = useState("");
  const [creditor, setCreditor] = useState("");
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { user, isAuthenticated } = useAuth0(); // Obtener el user_id del usuario autenticado


  const postData = async () => {
    try {
      if (isAuthenticated) {
        await axios.post(`${serverUrl}/transactions/create`,
          {
            "groupId": groupId,
            "title": titulo,
            "state": "No pagada",
            "amount": amount,
            "email": user.email
          },
          { withCredentials: true }) // Ruta del back para obtener deudas segun el id del grupo
      }
      onClose();
    } catch (error) {
      console.error("Error al crear Transacciones", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Ingresar nuevo gasto</h2>
        <div className='popup-body'>
          <label> <strong>Título</strong> </label>
          <input
            type="text"
            placeholder="Título del gasto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)} //
          />
          <label> <strong>Monto</strong> </label>
          <input
            type="text"
            placeholder="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} //
          />
          <label> <strong>Prestador / Pagado por:</strong> </label>
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
          />
        </div>
        <div className='popup-actions'>
          <button onClick={onClose} className="boton_rojo">Cerrar</button>
          <button onClick={postData} className='boton_naranja'>Crear Deuda</button>
        </div>
      </div>
    </div>
  );
}
