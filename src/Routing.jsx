import { Route, Routes } from 'react-router-dom';
import App from './App';
import TestComponents from './views/TestComponents';
import YourGroups from './views/YourGroups';
import CreateGroup from './views/CreateGroup';
import MyContacts from './views/MyContacts';
import GroupBalance from './views/GroupBalance';
import Profile from './views/MyProfile';

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/groupcard" element={<TestComponents />} />
            <Route path="/yourgroups" element={<YourGroups />} />
            <Route path="/creategroup" element={<CreateGroup />} />
            <Route path="/mycontacts" element={<MyContacts />} />
            <Route path="/group/:id" element={<GroupBalance />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    )
}