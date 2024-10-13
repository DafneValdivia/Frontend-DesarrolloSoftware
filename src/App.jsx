import './App.css'
import foto from './assets/fotoLanding.png'
import axios from 'axios'
import { useState } from 'react'

function App() {

  const [data, setData] = useState('')

  const handleButtonClick = async () => {
    try {
      const response = await axios.get('https://pudupay-backend.onrender.com')
      // console.log(response.data)
      setData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className='card'>
        <div className="left_card">
        <h1>PuduPay</h1>
        <h2>Divide y lleva la cuenta de gastos compartidos de la manera más fácil</h2>
          <button className='boton_empezar' onClick={handleButtonClick}>
            Empieza ahora
          </button>
        </div>
        <div className='right_card'>
          <img src={foto} className="foto" alt="Foto" />
        </div>
        <h2>{data}</h2>
      </div>
    </>
  )
}

export default App
