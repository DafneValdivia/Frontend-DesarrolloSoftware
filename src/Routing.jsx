import { Route, Routes } from 'react-router-dom';
import App from './App';
import TestComponents from './views/TestComponents';
import YourGroups from './views/YourGroups';
import CreateGroup from './views/CreateGroup';

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/groupcard" element={<TestComponents />} />
            <Route path="/yourgroups" element={<YourGroups />} />
            <Route path="/creategroup" element={<CreateGroup />} />
        </Routes>
    )
}