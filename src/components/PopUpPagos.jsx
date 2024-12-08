import React, { useState, useEffect } from 'react';
import axios from "axios";
import './PopUp.css';
import '../App.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function PopupPagos({ onClose, groupId }) {
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
        console.log(groupMembers);
        console.log(users)
      } catch (error) {
        console.error("Error fetching data", error);
      }
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

    const totalDebtAmount = debtDetails.reduce(
      (sum, debt) => sum + Number(debt.amount.replace(/\./g, '') || 0),
      0
    );
    if (totalDebtAmount !== Number(amount.replace(/\./g, ''))) {
      alert("La suma de las deudas debe ser igual al monto total");
      return false;
    }
    const allMembersSelected = debtDetails.every(debt => debt.id);
    if (!allMembersSelected) {
      alert("Debe seleccionar un deudor para cada detalle de deuda");
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

      const userEmail = users.find(user => user.id === creditor.user_id)?.mail;

      if (!userEmail) {
        alert("No se pudo encontrar el email del prestador.");
        return;
      }


      const token = await getAccessTokenSilently();
      await axios.post(`${serverUrl}/transactions/create`, {
        groupId: groupId,
        state: "No pagada",
        amount: Number(amount.replace(/\./g, '')),
        email: userEmail, // Email del prestador seleccionado
        dueDate: "2024-12-31", // Ajustar la fecha de vencimiento según sea necesario
      }, { headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            }
       });

      onClose();
    } catch (error) {
      console.error("Error al crear Transacciones", error);
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
