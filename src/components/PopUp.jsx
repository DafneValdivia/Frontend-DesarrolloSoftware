import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import './PopUp.css';
import '../App.css';

export default function Popup({ onClose, groupId }) {
  const [titulo, setTitulo] = useState("");
  const [amount, setAmount] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedCreditor, setSelectedCreditor] = useState("");
  const [debtDetails, setDebtDetails] = useState([]);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.get(`${serverUrl}/groups/${groupId}/members`, {
          withCredentials: true
        });
        setGroupMembers(response.data);
      } catch (error) {
        console.error("Error fetching group members", error);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  const handleAddDebtDetail = () => {
    setDebtDetails([...debtDetails, { memberId: "", amount: "" }]);
  };

  const updateDebtDetail = (index, field, value) => {
    if (field === 'amount') {
      const intValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
      if (intValue.length > 7) return; // Límite de 7 dígitos
      const formattedValue = Number(intValue).toLocaleString("es-CL");
      const newDebtDetails = [...debtDetails];
      newDebtDetails[index][field] = formattedValue;
      setDebtDetails(newDebtDetails);
    } else {
      const newDebtDetails = [...debtDetails];
      newDebtDetails[index][field] = value;
      setDebtDetails(newDebtDetails);
    }
  };

  const removeDebtDetail = (indexToRemove) => {
    setDebtDetails(debtDetails.filter((_, index) => index !== indexToRemove));
  };

  const validateDebtDetails = () => {
    const totalDebtAmount = debtDetails.reduce(
      (sum, debt) => sum + Number(debt.amount.replace(/\./g, '') || 0),
      0
    );
    return totalDebtAmount === Number(amount.replace(/\./g, '') || 0);
  };

  const handleAmountChange = (value) => {
    const intValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (intValue.length > 7) return; // Límite de 7 dígitos
    const formattedValue = Number(intValue).toLocaleString("es-CL");
    setAmount(formattedValue);
  };

  const handleTitleChange = (value) => {
    if (value.length > 20) return; // Límite de 20 caracteres
    setTitulo(value);
  };

  const postData = async () => {
    if (!validateDebtDetails()) {
      alert("La suma de las deudas debe ser igual al monto total");
      return;
    }

    try {
      if (isAuthenticated) {
        await axios.post(`${serverUrl}/transactions/create`, {
          groupId: groupId,
          title: titulo,
          state: "No pagada",
          amount: Number(amount.replace(/\./g, '')),
          email: user.email,
          debtsArray: debtDetails.map(debt => ({
            id: debt.memberId,
            amount: Number(debt.amount.replace(/\./g, ''))
          }))
        }, { withCredentials: true });
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

        <div className="popup-body">
          <label>Título del gasto</label>
          <input 
            type="text" 
            value={titulo} 
            onChange={(e) => handleTitleChange(e.target.value)} 
            className="input-field"
          />

          <label>Monto total</label>
          <div className="input-with-prefix">
            <span className="prefix">$</span>
            <input 
              type="text" 
              value={amount} 
              onChange={(e) => handleAmountChange(e.target.value)} 
              className="input-field"
            />
          </div>

          <label>Prestador / Pagado por</label>
          <select 
            value={selectedCreditor}
            onChange={(e) => setSelectedCreditor(e.target.value)}
            className="input-field"
          >
            <option value="">Seleccionar...</option>
            {groupMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.username}
              </option>
            ))}
          </select>

          <h3>Detalle de Deudas</h3>
          {debtDetails.map((debt, index) => (
            <div key={index} className="debt-detail">
              <select 
                value={debt.memberId}
                onChange={(e) => updateDebtDetail(index, 'memberId', e.target.value)}
                className="input-field"
              >
                <option value="">Seleccionar deudor</option>
                {groupMembers
                  .filter(member => 
                    member.id !== selectedCreditor && 
                    !debtDetails.some(d => d.memberId === member.id)
                  )
                  .map(member => (
                    <option key={member.id} value={member.id}>
                      {member.username}
                    </option>
                  ))
                }
              </select>
              <div className="input-with-prefix">
                <span className="prefix">$</span>
                <input 
                  type="text" 
                  placeholder="Monto de deuda"
                  value={debt.amount}
                  onChange={(e) => updateDebtDetail(index, 'amount', e.target.value)}
                  className="input-field"
                />
              </div>
              <button 
                onClick={() => removeDebtDetail(index)} 
                className="remove-button"
              >
                Eliminar
              </button>
            </div>
          ))}

          <button 
            onClick={handleAddDebtDetail} 
            className="add-button"
          >
            + Añadir Deuda
          </button>

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
              Crear Deuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
