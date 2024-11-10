import React, {useState} from 'react';
import './PopUp.css';
import '../App.css'

export default function Popup({onClose}) {
    const [titulo, setTitulo] = useState(""); 
    const [amount, setAmount] = useState(""); 
    const [creditor, setCreditor] = useState(""); 
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
            <button className='boton_naranja'>Crear Deuda</button>
          </div> 
      </div>
    </div>
  );
}
