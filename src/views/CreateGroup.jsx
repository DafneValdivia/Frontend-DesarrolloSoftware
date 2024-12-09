import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CreateGroupForm from '../components/CreateGroupForm';
import "./CreateGroup.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function CreateGroup() {
    const [groupsData, setGroupsData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [contactos, setContactos] = useState([]);
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                try {
                    setLoading(true);
                    const token = await getAccessTokenSilently();

                    // Obtener los grupos
                    const groupsResponse = await axios.get(`${serverUrl}/groups/user/${user.email}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setGroupsData(groupsResponse.data);

                    // Obtener los contactos
                    const contactosResponse = await axios.get(`${serverUrl}/contacts/user/${user.email}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setContactos(contactosResponse.data);

                    setLoading(false);
                } catch (error) {
                    console.error("Hubo un problema al cargar los datos:", error);
                    setError("Hubo un problema al cargar los datos");
                    setLoading(false);
                }
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, getAccessTokenSilently, user, serverUrl]);

    const handleGroupCreation = async (groupData) => {
        try {
            const token = await getAccessTokenSilently();
            
            const requestBody = {
                name: groupData.groupName,
                total_amount: 0,
                invitedUsers: groupData.members.map(member => member.mail),
                email: user.email,
            };

            const response = await axios.post(
                `${serverUrl}/groups/create`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Grupo creado exitosamente.");

            // Actualiza los datos de los grupos localmente
            setGroupsData([...groupsData, response.data]);
        } catch (error) {
            console.error("Error al crear el grupo:", error);
            alert("Hubo un error al crear el grupo. Intenta nuevamente.");
        }
    };
    
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="createGroup-page-container">
                <CreateGroupForm 
                    onGroupCreate={handleGroupCreation} 
                    gruposExistentes={groupsData.map(group => group.name)}
                />
            </div>
        </div>
    );
}