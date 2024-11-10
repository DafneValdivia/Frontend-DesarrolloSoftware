import React, { useState, useEffect } from "react";
import GroupCard from "../components/GroupCard";
import "./YourGroups.css";
import Navbar from '../components/Navbar';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

export default function YourGroups() {

    const [searchTerm, setSearchTerm] = useState("");
    const [groupsData, setGroupsData] = useState([]); // Estado para los datos de grupos
    const [loading, setLoading] = useState(true); // Estado para mostrar carga
    const [error, setError] = useState(null);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        // Función para hacer la llamada a la API
        const fetchGroups = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                setLoading(true);
                const response = await axios.get("http://localhost:3000/groups/", {
                    withCredentials: true});
                setGroupsData(response.data);
                setLoading(false);
            } catch (error) {
                setError("Hubo un problema al cargar los grupos");
                setLoading(false);
            }
        };

        fetchGroups(); // Llama a la función al montar el componente
        console.log(groupsData);
    }, []);

    const filteredGroups = groupsData.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div id="groups-container">
                <input
                    id="search-bar"
                    type="text"
                    placeholder="Buscar grupo..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div id="group-cards">  
                    {filteredGroups.length > 0 ? (
                            filteredGroups.map(group => (
                                <GroupCard 
                                    key={group.id} 
                                    groupName={group.name} 
                                    onClick={() => console.log(`Clicked on ${group.name}`)} 
                                />
                            ))
                        ) : (
                            <div id="no-groups-message">
                                <h2>No se encontraron grupos con ese nombre...</h2>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}