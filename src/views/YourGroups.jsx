import React, { useState } from "react";
import GroupCard from "../components/GroupCard";
import "./YourGroups.css";
import Navbar from '../components/Navbar';

export default function YourGroups() {

    const [searchTerm, setSearchTerm] = useState("");

    const groupsData = [
        { id: 1, groupName: "Grupo A" },
        { id: 2, groupName: "Grupo B" },
        { id: 3, groupName: "Grupo C" },
        { id: 4, groupName: "Grupo D" },
        { id: 5, groupName: "Grupo C" },
        { id: 6, groupName: "Grupo D" },
        { id: 7, groupName: "Grupo C" },
        { id: 8, groupName: "Grupo D" }
    ];

    const filteredGroups = groupsData.filter(group => 
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
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
                                    groupName={group.groupName} 
                                    onClick={() => console.log(`Clicked on ${group.groupName}`)} 
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