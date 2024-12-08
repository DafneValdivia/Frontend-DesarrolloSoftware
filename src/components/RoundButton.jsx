import React from 'react';
import './RoundButton.css';
import img_button from '../assets/RoundButton.png';

const RoundButton = ({ onClick, altText }) => {
    return (
        <div className="button-container">
            <span className="button-text">{altText}  </span>
            <button className="round-button" onClick={onClick}>
                <img src={img_button} alt={altText} className="button-image" />
            </button>
        </div>
    );
};

export default RoundButton;