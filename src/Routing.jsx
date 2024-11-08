import { Route, Routes } from 'react-router-dom';
import App from './App';
import TestComponents from './views/TestComponents';
import GroupBalance from './views/GroupBalance';

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/groupcard" element={<TestComponents />} />
            <Route path="/group" element={<GroupBalance />} />
        </Routes>
    )
}