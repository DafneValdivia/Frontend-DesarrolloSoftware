import React, { useState, useEffect } from 'react';
import axios from "axios";
import './PopUp.css';
import '../App.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function PopupPagos({ onClose, groupId, balanceData }) {
  const [amount, setAmount] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [users, setUsers] = useState([]); // Para almacenar los usuarios desde la API
  const [selectedCreditor, setSelectedCreditor] = useState("");
  const [debtDetails, setDebtDetails] = useState([]);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0(); // Obtener el user_id del usuario autenticado

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const groupMembersResponse = await axios.get(`${serverUrl}/groups/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          }
        });
        setGroupMembers(groupMembersResponse.data);

        const usersResponse = await axios.get(`${serverUrl}/users`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          }
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
        console.log(`miembros: ${groupMembers}`);
        console.log(`usuarios: ${users}`);
    };

    fetchGroupData();
  }, [groupId]);

  const handleAmountChange = (value) => {
    const intValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (intValue.length > 7) return; // Límite de 7 dígitos
    const formattedValue = Number(intValue).toLocaleString("es-CL");
    setAmount(formattedValue);
  };



  const validateDebtDetails = () => {
    if (!amount || !selectedCreditor) {
      alert("Todos los campos son obligatorios");
      return false;
    }

    if (amount === "0"){
      alert("Por favor ingrese un monto mayor a 0");
      return false;
    }

    return true;
  };


  const postData = async () => {

    if (!validateDebtDetails()) return;

    try {
      const creditor = groupMembers.find(member => member.member_id === selectedCreditor);
            if (!creditor) {
              alert("Error al identificar el prestador.");
              return;
            }

      const creditorEmail = users.find(user => user.id === creditor.user_id)?.mail;
      if (!creditorEmail) {
        alert("No se pudo encontrar el email del prestador.");
        return;
      }

      const creditorName = users.find(user => user.id === creditor.user_id)?.username;
      if (!creditorName) {
        alert("No se pudo encontrar el nombre del prestador.");
        return;
      }

      const debtorName = users.find(usuario => usuario.mail === user.email)?.username;
            if (!debtorName) {
              alert("Error al identificar tu nombre.");
              return;
            }

      if (creditorEmail === user.email) {
        alert("No puede seleccionarse a sí mismo como prestador");
        return;
      }

      // Validar que el monto no exceda el balance
      const balanceEntry = balanceData.find(
        balance => balance.fromName === debtorName && balance.toName === creditorName
      );

      if (!balanceEntry) {
        alert("No existe una deuda pendiente para el usuario seleccionado.");
        return;
      }

      const maxAmount = balanceEntry.amount;
      const paymentAmount = Number(amount.replace(/\./g, ''));
      if (paymentAmount > maxAmount) {
        alert(`El monto ingresado excede la deuda pendiente. Máximo permitido: $${maxAmount.toLocaleString("es-CL")}`);
        return;
      }

      const token = await getAccessTokenSilently();
      await axios.post(`${serverUrl}/payments/create`, {
        groupId: groupId,
        debtorMail:  user.email,
        amount: paymentAmount,
        creditorMail: creditorEmail,
      }, { headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            }
       });

      //onClose();
      alert("Pago ingresado con éxito")
    } catch (error) {
      console.error("Error al crear Transacciones", error);
      alert("Ha ocurrido un error. Inténtelo nuevamente.")
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Ingresar nuevo pago</h2>

        <div className="popup-body">
          <label>Monto pagado</label>
          <div className="input-with-prefix">
            <span className="prefix">$</span>
            <input 
              type="text" 
              value={amount} 
              onChange={(e) => handleAmountChange(e.target.value)} 
              className="input-field"
            />
          </div>

          <label>Pagar a:</label>
          <select 
            value={selectedCreditor}
            onChange={(e) => setSelectedCreditor(e.target.value)}
            className="input-field"
            placeholder="Seleccionar usuario"
          >
            {groupMembers.map(member => (
              <option key={member.member_id} value={member.member_id}>
                {member.username}
              </option>
            ))}
          </select>

          <div className="popup-actions">
            <button 
              onClick={onClose} 
              className="cancel-button"
            >
              Cerrar
            </button>
            <button 
              onClick={postData} 
              className="submit-button"
            >
              Ingresar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
