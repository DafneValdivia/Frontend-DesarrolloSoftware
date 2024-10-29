import React, { useState } from "react";
import '../App.css';
import './GroupBalance.css'

export default function GroupBalance() {

    const balanceData = [
        {deuda_id: 1, state: "Pendiente", deudor: "Pedrito", prestador: "pepito", amount: 15000},
        {deuda_id: 2, state: "Pagado", deudor: "Paula", prestador: "Cata", amount: 15000},
        {deuda_id: 3, state: "En proceso", deudor: "Isa", prestador: "Nico", amount: 9900},
        {deuda_id: 4, state: "En proceso", deudor: "Pelao", prestador: "Mari", amount: 150},
        {deuda_id: 5, state: "Pendiente", deudor: "Niko", prestador: "Dafne", amount: 7000},
        {deuda_id: 6, state: "Pagado", deudor: "Fernanda", prestador: "pepito", amount: 1000},
        {deuda_id: 7, state: "Pendiente", deudor: "Valentina", prestador: "Lucas", amount: 15000},
        {deuda_id: 8, state: "Pagado", deudor: "Antonia", prestador: "Naty", amount: 15000},
        {deuda_id: 9, state: "En proceso", deudor: "Max", prestador: "Vicho", amount: 15000},
    ]

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
    
    const [filter, setFilter] = useState("todos");
    // Filtrar deudas según el estado seleccionado
    const filteredData = balanceData.filter((deuda) => {
        if (filter === "todos") return true; // Mostrar todas las deudas
        return deuda.state === filter; // Filtrar por estado
    });
    return (
        <div>
            <h2>Balance Grupal</h2>

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
                    {filteredData.map((deuda) => (
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
        </div>
    )
}