import React, { useState, useEffect } from 'react';
import axios from "axios";
import './PopUp.css';
import '../App.css';

export default function Popup({ onClose, groupId }) {
  const [titulo, setTitulo] = useState("");
  const [amount, setAmount] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [users, setUsers] = useState([]); // Para almacenar los usuarios desde la API
  const [selectedCreditor, setSelectedCreditor] = useState("");
  const [debtDetails, setDebtDetails] = useState([]);
  const [divideEqually, setDivideEqually] = useState(false); // Estado para dividir en partes iguales
  const [equalSplitDetails, setEqualSplitDetails] = useState([]); // Detalles del pago dividido

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupMembersResponse = await axios.get(`${serverUrl}/groups/${groupId}/members`, {
          withCredentials: true
        });
        setGroupMembers(groupMembersResponse.data);

        const usersResponse = await axios.get(`${serverUrl}/users`, {
          withCredentials: true
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleAddDebtDetail = () => {
    setDebtDetails([...debtDetails, { id: "", amount: "" }]);
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

  const handleAmountChange = (value) => {
    const intValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (intValue.length > 7) return; // Límite de 7 dígitos
    const formattedValue = Number(intValue).toLocaleString("es-CL");
    setAmount(formattedValue);

    if (divideEqually) {
      handleDivideEqually(formattedValue);
    }
  };

  const handleTitleChange = (value) => {
    if (value.length > 20) return; // Límite de 20 caracteres
    setTitulo(value);
  };

  const handleDivideEqually = (totalAmount) => {
    const total = Number(totalAmount.replace(/\./g, ''));
    const allMembers = groupMembers;
    const numMembers = allMembers.length;
  
    if (numMembers === 0) {
      setEqualSplitDetails([]);
      return;
    }
  
    const baseAmount = Math.ceil(total / numMembers); // Redondear hacia arriba
  
    // Generar los detalles de la división
    const splitDetails = allMembers.map((member) => ({
      id: member.user_id, // Usar `user_id` para el estándar
      name: member.username,
      amount: baseAmount.toLocaleString("es-CL")
    }));
  
    setEqualSplitDetails(splitDetails);
  
    // Actualizar `debtDetails` con los IDs y montos
    setDebtDetails(splitDetails.map(({ id, amount }) => ({ id, amount })));
  };
  
  

  const handleCheckboxChange = (checked) => {
    setDivideEqually(checked);

    if (checked) {
      handleDivideEqually(amount);
    } else {
      setDebtDetails([]);
      setEqualSplitDetails([]);
    }
  };

  const validateDebtDetails = () => {
    if (!titulo || !amount || !selectedCreditor) {
      alert("Todos los campos son obligatorios");
      return false;
    }

    if (divideEqually) {
      if (equalSplitDetails.length === 0) {
        alert("No se puede dividir en partes iguales sin miembros.");
        return false;
      }
      const totalSplitAmount = equalSplitDetails.reduce(
        (sum, debt) => sum + Number(debt.amount.replace(/\./g, '') || 0),
        0
      );
      return true;
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

      const debtsArray = divideEqually 
        ? equalSplitDetails.map(debt => ({
            id: debt.id,
            amount: Number(debt.amount.replace(/\./g, ''))
          }))
        : debtDetails.map(debt => ({
            id: debt.id,
            amount: Number(debt.amount.replace(/\./g, ''))
          }));

      await axios.post(`${serverUrl}/transactions/create`, {
        groupId: groupId,
        title: titulo,
        state: "No pagada",
        amount: Number(amount.replace(/\./g, '')),
        email: userEmail, // Email del prestador seleccionado
        dueDate: "2024-12-31", // Ajustar la fecha de vencimiento según sea necesario
        debtsArray: debtsArray
      }, { withCredentials: true });

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
              <option key={member.member_id} value={member.member_id}>
                {member.username}
              </option>
            ))}
          </select>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="divide-equally"
              checked={divideEqually}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
            <label htmlFor="divide-equally">Dividir en partes iguales</label>
          </div>

          {divideEqually && (
            <div className="equal-split-details">
              <h3>Detalle división</h3>
              <ul>
                {equalSplitDetails.map(detail => (
                  <li key={detail.id} id="equal-amounts-li">
                    {detail.name}: ${detail.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!divideEqually && (
            <>
              <h3>Detalle de Deudas</h3>
              {debtDetails.map((debt, index) => (
                <div key={index} className="debt-detail">
                  <select 
                    value={debt.id}
                    onChange={(e) => updateDebtDetail(index, 'id', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Seleccionar deudor</option>
                    {groupMembers
                      .filter(member => 
                        member.member_id !== selectedCreditor && 
                        !debtDetails.some(d => d.id === member.user_id)
                      )
                      .map(member => (
                        <option key={member.member_id} value={member.user_id}>
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
            </>
          )}

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
