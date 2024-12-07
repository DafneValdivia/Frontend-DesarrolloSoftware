import React, { useState, useEffect } from "react";
import '../App.css';
import './GroupBalance.css'
import RoundButton from "../components/RoundButton";
import Popup from "../components/PopUp";
import Navbar from '../components/Navbar';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";

const GroupBalance = () => {
    const { id: groupId } = useParams();  // Obtiene 'id' de la URL como 'groupId'

    // const balanceData = [
    //     { deuda_id: 1, state: "Pendiente", deudor: "Pedrito", prestador: "pepito", amount: 15000 },
    //     { deuda_id: 8, state: "Pagado", deudor: "Antonia", prestador: "Naty", amount: 15000 },
    //     { deuda_id: 9, state: "En proceso", deudor: "Max", prestador: "Vicho", amount: 15000 },
    //     { deuda_id: 2, state: "Pagado", deudor: "Paula", prestador: "Cata", amount: 15000 },
    //     { deuda_id: 3, state: "En proceso", deudor: "Isa", prestador: "Nico", amount: 9900 },
    //     { deuda_id: 4, state: "En proceso", deudor: "Pelao", prestador: "Mari", amount: 150 },
    //     { deuda_id: 5, state: "Pendiente", deudor: "Niko", prestador: "Dafne", amount: 7000 },
    //     { deuda_id: 6, state: "Pagado", deudor: "Fernanda", prestador: "pepito", amount: 1000 },
    //     { deuda_id: 7, state: "Pendiente", deudor: "Valentina", prestador: "Lucas", amount: 15000 },
    // ] // DEUDAS del grupo

    // const transactions = [
    //     {id: 1, title: "Castaño", creditorName: "Pedrito", amount: 15000},
    //     {id: 2, title: "Hamburguesa", creditorName: "Cata", amount: 6000},
    //     {id: 3, title: "Bencina", creditorName: "Mari", amount: 50000},
    //     {id: 4, title: "Estadía", creditorName: "Pedrito", amount: 150000},
    //     {id: 5, title: "Bencina", creditorName: "Paula", amount: 5000},
    // ] // TRANSACTIONS del grupo

    const [transactions, setTransactions] = useState([]);
    const [balanceData, setBalanceData] = useState([]);
    const { user, isAuthenticated } = useAuth0();

    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/transactions/group/${groupId}`, {
                withCredentials: true
            }) // Ruta del back para obtener deudas segun el id del grupo
            setTransactions(response.data);

            const response_debts = await axios.get(`${import.meta.env.VITE_SERVER_URL}/debts/${groupId}`, {
                withCredentials: true
            })
            console.log("ALOOO:", response_debts.data);
            setBalanceData(response_debts.data);
        } catch (error) {
            console.error("Error al obtener Transacciones", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated, user, groupId]);

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
        const matchesDeudor = searchDeudor === "" || deuda.debtor_name.username.toString().includes(searchDeudor);
        const matchesPrestador = searchPrestador === "" || deuda.creditor_name.username.toLowerCase().includes(searchPrestador.toLowerCase());
        return matchesFilter && matchesDeudor && matchesPrestador;
    });
    const filteredTransactions = balanceData.filter((deuda) => {
        const matchesFilter = filter === "todos" || deuda.state === filter;
        const matchesDeudor = searchDeudor === "" || deuda.debtor_name.username.toString().includes(searchDeudor);
        const matchesPrestador = searchPrestador === "" || deuda.creditor_name.username.toLowerCase().includes(searchPrestador.toLowerCase());
        return matchesFilter && matchesDeudor && matchesPrestador;
    });
    const sortedBalances = [...filteredBalances].sort((a, b) => a.deuda_id - b.deuda_id);
    const sortedTransactions = [...filteredTransactions].sort((a, b) => a.deuda_id - b.deuda_id);

    const [popUp, setPopUp] = useState(null);
    const [option, setOption] = useState("balance");

    const handlePopUpClose = () => {
        setPopUp(null);  // Cierra el popup
        fetchData();  // Recarga los datos
    };

    return (
        <div>
            <Navbar />
            <div className='filters'>
                <button className={`button ${option === 'balance' ? 'activeButton' : ''}`} onClick={() => setOption('balance')}>Balance Grupal</button>
                <button className={`button ${option === 'historial' ? 'activeButton' : ''}`} onClick={() => setOption('historial')}>Historial de Transacciones</button>
            </div>

            {option === "historial" && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaccion) => (
                                <tr key={transaccion.id}>
                                    <td>{transaccion.title}</td>
                                    <td>{transaccion.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {option === "balance" && (
                <div>
                    <div className="filters">
                        {/* Filtrar por estado */}

                        {/* <div className="filter">
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
                        </div> */}


                        {/* Buscar Deudor */}

                        {/* <div className="filter">
                            <label className='label_filter'>Buscar Deudor:</label>
                            <input
                                type="text"
                                placeholder="Ej. 1"
                                value={searchDeudor}
                                onChange={(e) => setSearchDeudor(e.target.value)}
                            />
                        </div> */}


                        {/* Buscar Prestador */}

                        {/* <div className="filter">
                            <label className="label_filter">Buscar Prestador:</label>
                            <input
                                type="text"
                                placeholder="Ej. Persona A"
                                value={searchPrestador}
                                onChange={(e) => setSearchPrestador(e.target.value)}
                            />
                        </div> */}

                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Deudor</th>
                                <th>Prestador</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBalances.map((deuda) => (
                                <tr key={deuda.id}>
                                    <td className={getStateClass(deuda.state)}>{deuda.state}</td>
                                    <td>{deuda.debtor_name?.username || "Desconocido"}</td>  {/* Asegúrate de que deudor_name existe */}
                                    <td>{deuda.creditor_name?.username || "Desconocido"}</td>  {/* Asegúrate de que creditor_name existe */}
                                    <td>{deuda.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <RoundButton
                        onClick={(e) => setPopUp("on")}
                        altText="Agregar deuda" // Texto alternativo
                    />
                </div>)}

            {popUp && <Popup groupId={groupId} onClose={handlePopUpClose} />}

        </div>)
}

GroupBalance.propTypes = {
    groupId: PropTypes.string.isRequired
};

export default GroupBalance;