import React, { useState, useEffect } from 'react';
import './PopUp.css';
import '../App.css'
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react"; // Si estás usando Auth0

export default function Popup({ groupId, onClose }) {
  const [titulo, setTitulo] = useState("");
  const [amount, setAmount] = useState("");
  const [creditor, setCreditor] = useState("");
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { user, isAuthenticated } = useAuth0(); // Obtener el user_id del usuario autenticado
  const [alertMessage, setAlertMessage] = useState(null);  // Para manejar la alerta
  const [alertType, setAlertType] = useState(''); // Para el tipo de alerta (éxito o error)
  const [usuarios, setUsuarios] = useState([]);

  // const fetchData = async () => {
  //     try {
  //       const response_members = await axios.get(`http://localhost:3000/groups/${groupId}/members`, {
  //               withCredentials: true
  //           })
  //           //console.log("Miembros:", response_members.data);
  //           const response_users = await axios.get(`http://localhost:3000/users`, {
  //               withCredentials: true
  //           })
  //           //console.log("Users:", response_users.data);

  //           // Asocia información de usuarios con los miembros
  //           const enrichedMembers = response_members.data.map((member) => {
  //               const user = response_users.data.find((u) => u.id === member.user_id);
  //               return {
  //                   ...member,
  //                   username: user?.username || "Desconocido",
  //                   mail: user?.mail || "Sin correo",
  //                   phone: user?.phone || "Sin número de teléfono",
  //               };
  //           });
  //         setUsuarios(enrichedMembers);

  //     } catch (error) {
  //         console.error("Error al obtener usuarios", error);
  //     }
  // };

    // useEffect(() => {
    //     fetchData();
    // }, [isAuthenticated, user]);


  const postData = async () => {
    try {
      if (isAuthenticated) {
        await axios.post(`${serverUrl}/transactions/create`,
          {
            "groupId": groupId,
            "title": titulo,
            //"state": "No pagada",
            "amount": amount,
            "payer_id": user
          },
          { withCredentials: true }) // Ruta del back para crear transacción
      }
      onClose();
    } catch (error) {
      console.error("Error al crear Transacciones", error);
    }
  };

  // Formatear el monto ingresado
  const handleAmountChange = (e) => {
    const input = e.target.value.replace(/\./g, ""); // Eliminar puntos existentes
    if (/^\d*$/.test(input)) { // Permitir solo números
      const formatted = Number(input).toLocaleString("es-CL"); // Formato con separador de miles
      setAmount(formatted);
    }
    console.log(`monto: ${amount}`);
    console.log(`user: ${user.id}`);
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
            onChange={handleAmountChange} //
          />
          {/* <label> <strong>Prestador / Pagado por:</strong> </label>
          <input
            type="text"
            list="members"
            placeholder="Nombre de Usuario"
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
          />
          <datalist id="members"> 
            {usuarios.map((usuario, index) => (
              <option key={index} value={usuario.mail}>{usuario.username}</option>
            ))}
          </datalist> */}
        </div>
        <div className='popup-actions'>
          <button onClick={onClose} className="boton_rojo">Cerrar</button>
          <button onClick={postData} className='boton_naranja'>Crear Deuda</button>
        </div>
      </div>
    </div>
  );
}
