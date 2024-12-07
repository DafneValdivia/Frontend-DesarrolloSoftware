import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useAuthToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Función para obtener el token
  const fetchToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: import.meta.env.VITE_AUTH0_SCOPE,
        },
      });
      setToken(accessToken);  // Guardamos el token en el estado
    } catch (err) {
      setError('Error al obtener el token');  // Manejo de errores
      console.error(err);
    }
  };

  return { token, error, fetchToken };  // Retorna el token, el error y la función para obtener el token
};

export default useAuthToken;
