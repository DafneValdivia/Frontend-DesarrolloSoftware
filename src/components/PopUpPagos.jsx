import React, { useState, useEffect } from 'react';
import axios from "axios";
import './PopUp.css';
import '../App.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function PopupPagos({ onClose, groupId, balanceData }) {
  const [amount, setAmount] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedCreditor, setSelectedCreditor] = useState("");
  const [users, setUsers] = useState([]);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const groupMembersResponse = await axios.get(`${serverUrl}/groups/members/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setGroupMembers(groupMembersResponse.data);

        const usersResponse = await axios.get(`${serverUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleAmountChange = (value) => {
    const intValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (intValue.length > 7) return;
    const formattedValue = Number(intValue).toLocaleString("es-CL");
    setAmount(formattedValue);
  };

  const validateDebtDetails = () => {
    if (!amount || !selectedCreditor) {
      alert("Todos los campos son obligatorios");
      return false;
    }

    if (amount === "0") {
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

      const debtorName = users.find(usuario => usuario.mail === user.email)?.id;
      if (!debtorName) {
        alert("Error al identificar tu id.");
        return;
      }

      const debtorMemberId = groupMembers.find(usuario => usuario.user_id === debtorName)?.member_id;
      if (!debtorMemberId) {
        alert("Error al identificar tu member id.");
        return;
      }

      if (creditor.member_id === debtorMemberId) {
        alert("No puede seleccionarse a sí mismo como prestador");
        return;
      }

      const token = await getAccessTokenSilently();
      await axios.post(`${serverUrl}/payments/create`, {
        groupId: groupId,
        debtorId: debtorMemberId,
        creditorId: creditor.member_id,
        amount: Number(amount.replace(/\./g, '')),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      alert("Pago ingresado con éxito");
      onClose();
    } catch (error) {
      console.error("Error al crear el pago", error);
      alert("Ha ocurrido un error. Inténtelo nuevamente.");
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
