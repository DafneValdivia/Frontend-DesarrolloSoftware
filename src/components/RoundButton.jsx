// src/app/components/RoundButton.js
import React from 'react';
import './RoundButton.css';
import img_button from '../assets/RoundButton.png'

const RoundButton = ({ onClick, altText }) => {
    return (
        <div>
            <span className="tooltip-text">Agregar nuevo gasto</span> 
            <button className="round-button" onClick={onClick}>
                <img src={img_button} alt={altText} className="button-image" />
            </button>
        </div>
        
    );
};

export default RoundButton;
