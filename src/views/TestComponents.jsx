import GroupCard from "../components/GroupCard";

export default function TestComponents() {

    const groupsData = [
        { id: 1, groupName: "Grupo A" },
        { id: 2, groupName: "Grupo B" },
        { id: 3, groupName: "Grupo C" },
        { id: 4, groupName: "Grupo D" }
    ];
    
    return (
        <div>
            {groupsData.map(group => (
                <GroupCard 
                    key={group.id} 
                    groupName={group.groupName} 
                    onClick={() => {}}
                />
            ))}
        </div>
    )
}