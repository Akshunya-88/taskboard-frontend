import { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('/accounts/me/')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
