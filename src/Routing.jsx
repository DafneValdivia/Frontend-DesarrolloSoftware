import { Route, Routes } from 'react-router-dom';
import App from './App';
import TestComponents from './views/TestComponents';

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/groupcard" element={<TestComponents />} />
        </Routes>
    )
}