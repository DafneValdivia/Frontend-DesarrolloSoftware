import React from 'react';
import ProfileInfo from '../components/ProfileInfo';
import InvitationField from '../components/InvitationField';
import './MyProfile.css';
import Navbar from '../components/Navbar';

const Profile = () => {
    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <ProfileInfo />
                <InvitationField />
            </div>
        </div>
    );
};

export default Profile;
