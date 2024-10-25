import React from 'react';
import './GroupCard.css';

export default function GroupCard({ groupName, onClick }) {
    return (
        <div className="group-card" onClick={onClick} >
            <h3 className='group-name'>{groupName}</h3>
        </div>
    )
}