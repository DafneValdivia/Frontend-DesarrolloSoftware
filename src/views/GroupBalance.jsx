import React, { useState, useEffect } from "react";
import '../App.css';
import './GroupBalance.css'
import RoundButton from "../components/RoundButton";

export default function GroupBalance() {

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

    {/*
    const [deudasData, setDeudasData] = useState("");
    
    useEffect(() => {
        // Función para obtener el staff de la API y separarlos en doctores y anestesistas
        const fetchData = async () => {
          try {
            const response = await axios.get(`${URL_BACK}deudas`); // Ruta del back para obtener deudas segun el id del grupo
            setDeudad(response);
          } catch (error) {
            console.error("Error al obtener datos", error);
          }
        };
        fetchData();
      }, []); */}

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
    const filteredData = balanceData.filter((deuda) => {
        const matchesFilter = filter === "todos" || deuda.state === filter;
        const matchesDeudor = searchDeudor === "" || deuda.deudor.toString().includes(searchDeudor);
        const matchesPrestador = searchPrestador === "" || deuda.prestador.toLowerCase().includes(searchPrestador.toLowerCase());
        return matchesFilter && matchesDeudor && matchesPrestador;
      });
    const sortedOperations = [...filteredData].sort((a, b) => a.deuda_id - b.deuda_id);

    const handleAddDebt = () => {
        const newDebt = {
            deuda_id: balanceData.length + 1,
            state: "Pendiente",
            deudor: "Nuevo Deudor",
            prestador: "Nuevo Prestador",
            amount: 10000,
        };
        setBalanceData([...balanceData, newDebt]);
    };

    return (
        <div>
            <h2>Balance Grupal</h2>
            <div className="filters">
              <div>
                <label htmlFor="filter">Filtrar por estado:</label>
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
                    className='input_filter'
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
                    className='input_filter'
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
                    {sortedOperations.map((deuda) => (
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
                onClick={handleAddDebt}
                altText="Agregar deuda" // Texto alternativo
            />
        </div>
    )
}