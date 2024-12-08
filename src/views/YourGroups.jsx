import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/GroupCard";
import "./YourGroups.css";
import Navbar from '../components/Navbar';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

export default function YourGroups() {

    const [searchTerm, setSearchTerm] = useState("");
    const [groupsData, setGroupsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchGroups = async () => {
            console.log("Cargando grupos...");
            console.log("Usuario autenticado:", isAuthenticated);
            console.log("Usuario:", user);
            console.log("Email:", user.email);
            try {
                const token = await getAccessTokenSilently();
                if (isAuthenticated && user) {
                    setLoading(true);
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/user/${user.email}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                        }
                    });
                    console.log("Grupos cargados:", response.data);
                    setGroupsData(response.data);
                } else {
                    console.log("Usuario no autenticado");
                }
                setLoading(false);
            } catch (error) {
                console.error("Hubo un problema al cargar los grupos:", error);
                setError("Hubo un problema al cargar los grupos");
                setLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchGroups();
        }
    }, [isAuthenticated, user]);

    const filteredGroups = groupsData.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNewGroupClick = () => {
        navigate("/creategroup");
    };

    // Nueva función para manejar la navegación a GroupBalance con groupId
    const handleGroupCardClick = (groupId, groupName) => {
        navigate(`/group/${groupId}`, { state: { groupName } });
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div>
            <Navbar />
            <div id="groups-container">
                <div id="new-group">
                    <div id="new-group-text">Nuevo grupo</div>
                    <button id="new-group-button" onClick={handleNewGroupClick}>
                        +
                    </button>
                </div>
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
                                onClick={() => handleGroupCardClick(group.id, group.name)}
                            />
                        ))
                    ) : (
                        <div id="no-groups-message">
                            <h2>No se encontraron grupos...</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
