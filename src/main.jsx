// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Routing from "./Routing";
import "./index.css";
// import Navbar from "./common/Navbar";
// import { Account } from "./components/Account";
// import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
