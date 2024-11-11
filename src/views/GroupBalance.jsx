import React, { useState, useEffect } from "react";
import '../App.css';
import './GroupBalance.css'
import RoundButton from "../components/RoundButton";
import Popup from "../components/PopUp";
import Navbar from '../components/Navbar';
import axios from "axios";

export default function GroupBalance({groupId}) {

    const balanceData = [
        {deuda_id: 1, state: "Pendiente", deudor: "Pedrito", prestador: "pepito", amount: 15000},
        {deuda_id: 8, state: "Pagado", deudor: "Antonia", prestador: "Naty", amount: 15000},
        {deuda_id: 9, state: "En proceso", deudor: "Max", prestador: "Vicho", amount: 15000},
        {deuda_id: 2, state: "Pagado", deudor: "Paula", prestador: "Cata", amount: 15000},
        {deuda_id: 3, state: "En proceso", deudor: "Isa", prestador: "Nico", amount: 9900},
        {deuda_id: 4, state: "En proceso", deudor: "Pelao", prestador: "Mari", amount: 150},
        {deuda_id: 5, state: "Pendiente", deudor: "Niko", prestador: "Dafne", amount: 7000},
        {deuda_id: 6, state: "Pagado", deudor: "Fernanda", prestador: "pepito", amount: 1000},
        {deuda_id: 7, state: "Pendiente", deudor: "Valentina", prestador: "Lucas", amount: 15000},
    ]

    const transactions = [
        {id: 1, title: "Castaño", creditorName: "Pedrito", amount: 15000},
        {id: 2, title: "Hamburguesa", creditorName: "Cata", amount: 6000},
        {id: 3, title: "Bencina", creditorName: "Mari", amount: 50000},
        {id: 4, title: "Estadía", creditorName: "Pedrito", amount: 150000},
        {id: 5, title: "Bencina", creditorName: "Paula", amount: 5000},
    ]

    {/*const [transactions, setTransactions] = useState("");
    
    useEffect(() => {
        // Función para obtener el staff de la API y separarlos en doctores y anestesistas
        const fetchData = async () => {
          try {
            const response = axios.get(`http://localhost:3000/transactions/group/${groupId}`, {
                withCredentials: true
            }) // Ruta del back para obtener deudas segun el id del grupo
            setTransactions(response);
          } catch (error) {
            console.error("Error al obtener Transacciones", error);
          }
        };
        fetchData();
      }, []);
    */}

    const getStateClass = (state) => {
        switch (state) {
            case "Pendiente":
                return "estado-pendiente";
            case "Pagado":
                return "estado-pagado";
            case "En proceso":
                return "estado-en-proceso";
            default:
                return "";
        }
    };
    const [searchDeudor, setSearchDeudor] = useState(""); // Estado para buscar deudor
    const [searchPrestador, setSearchPrestador] = useState(""); // Estado para buscar prestador
    const [filter, setFilter] = useState("todos");
    const filteredBalances = balanceData.filter((deuda) => {
        const matchesFilter = filter === "todos" || deuda.state === filter;
        const matchesDeudor = searchDeudor === "" || deuda.deudor.toString().includes(searchDeudor);
        const matchesPrestador = searchPrestador === "" || deuda.prestador.toLowerCase().includes(searchPrestador.toLowerCase());
        return matchesFilter && matchesDeudor && matchesPrestador;
      });
      const filteredTransactions = balanceData.filter((deuda) => {
          const matchesFilter = filter === "todos" || deuda.state === filter;
          const matchesDeudor = searchDeudor === "" || deuda.deudor.toString().includes(searchDeudor);
          const matchesPrestador = searchPrestador === "" || deuda.prestador.toLowerCase().includes(searchPrestador.toLowerCase());
          return matchesFilter && matchesDeudor && matchesPrestador;
        });
    const sortedBalances = [...filteredBalances].sort((a, b) => a.deuda_id - b.deuda_id);
    const sortedTransactions = [...filteredTransactions].sort((a, b) => a.deuda_id - b.deuda_id);

    const [popUp, setPopUp] = useState(null);
    const [option, setOption] = useState("balance");

    return (
        <div>
        <Navbar />
            <div className='filters'>
                <button className={`button ${option === 'balance' ? 'activeButton' : ''}`}  onClick={() => setOption('balance')}>Balance Grupal</button>
                <button className={`button ${option === 'historial' ? 'activeButton' : ''}`}  onClick={() => setOption('historial')}>Historial de Transacciones</button>
            </div>
            
             {option === "historial" && (
            <div>
                {/* <div className="filters">
                <div className="filter">
                <label className='label_filter'>Buscar Fecha:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)} // Actualizar el filtro al cambiar
                >
                    <option value="todos">Todos</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Pagado">Pagados</option>
                    <option value="En proceso">En proceso</option>
                </select>  
            </div>

            <div className="filter">
                <label className='label_filter'>Buscar Nombre Transacción:</label>
                <input
                    type="text"
                    placeholder="Ej. 1"
                    value={searchDeudor}
                    onChange={(e) => setSearchDeudor(e.target.value)}
                />  
            </div>
            <div className="filter">
                <label className="label_filter">Buscar Prestador:</label>
                <input
                    type="text"
                    placeholder="Ej. Persona A"
                    value={searchPrestador}
                    onChange={(e) => setSearchPrestador(e.target.value)}
                />
            </div>  
                </div> */}
            
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Prestador</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaccion) => (
                            <tr key={transaccion.id}>
                                <td>{transaccion.title}</td>
                                <td>{transaccion.creditorName}</td>
                                <td>{transaccion.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
             )}

            {option === "balance" &&( 
            <div>
            <div className="filters">
            <div className="filter">
                <label className='label_filter'>Filtrar por estado:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)} // Actualizar el filtro al cambiar
                >
                    <option value="todos">Todos</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Pagado">Pagados</option>
                    <option value="En proceso">En proceso</option>
                </select>  
            </div>

            {/* Buscador de Deudor */}
            <div className="filter">
                <label className='label_filter'>Buscar Deudor:</label>
                <input
                    type="text"
                    placeholder="Ej. 1"
                    value={searchDeudor}
                    onChange={(e) => setSearchDeudor(e.target.value)}
                />  
            </div>
            <div className="filter">
                {/* Buscador de Prstador */}
                <label className="label_filter">Buscar Prestador:</label>
                <input
                    type="text"
                    placeholder="Ej. Persona A"
                    value={searchPrestador}
                    onChange={(e) => setSearchPrestador(e.target.value)}
                />
            </div>  
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estado</th>
                        <th>Deudor</th>
                        <th>Prestador</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBalances.map((deuda) => (
                        <tr key={deuda.deuda_id}>
                            <td>{deuda.deuda_id}</td>
                            <td className={getStateClass(deuda.state)}>{deuda.state}</td>
                            <td>{deuda.deudor}</td>
                            <td>{deuda.prestador}</td>
                            <td>{deuda.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <RoundButton 
                onClick={(e) => setPopUp("on")}
                altText="Agregar deuda" // Texto alternativo
            />
             </div> )}

            {popUp && <Popup onClose={(e) => setPopUp(null)} />}

        
        </div>
    )
}