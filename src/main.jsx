import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Routing from "./Routing";
import "./index.css";
import Auth0ProviderWithHistory from "./auth0Provider";
// import Navbar from "./common/Navbar";
// import { Account } from "./components/Account";
// import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Auth0ProviderWithHistory>
          <Routing />
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
