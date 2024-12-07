import { Route, Routes } from 'react-router-dom';
import App from './App';
import TestComponents from './views/TestComponents';
import YourGroups from './views/YourGroups';
import CreateGroup from './views/CreateGroup';
import MyContacts from './views/MyContacts';
import GroupBalance from './views/GroupBalance';
import Profile from './views/MyProfile';
import ProtectedRoute from './ProtectedRoute';

export default function Routing() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<App />} />
            <Route path="/groupcard" element={<TestComponents />} />

            {/* Rutas protegidas */}
            <Route
                path="/yourgroups"
                element={
                    <ProtectedRoute>
                        <YourGroups />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/creategroup"
                element={
                    <ProtectedRoute>
                        <CreateGroup />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mycontacts"
                element={
                    <ProtectedRoute>
                        <MyContacts />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/group/:id"
                element={
                    <ProtectedRoute>
                        <GroupBalance />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}