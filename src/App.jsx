import './App.css'
import foto from './assets/fotoLanding.png'
import NavBar from './components/Navbar'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

function App() {

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      // Si está autenticado, redirige a /yourgroups
      navigate('/yourgroups');
    } else {
      // Si no está autenticado, redirige al inicio de sesión
      loginWithRedirect();
    }
  };

  return (
    <>
    <NavBar />
      <div className='card'>
        <div className="left_card">
        <h1>PuduPay</h1>
        <h2>Divide y lleva la cuenta de gastos compartidos de la manera más fácil</h2>
          <button className='boton_naranja' onClick={handleButtonClick}>
            Empieza ahora
          </button>
        </div>
        <div className='right_card'>
          <img src={foto} className="foto" alt="Foto" />
        </div>
      </div>
    </>
  )
}

export default App
