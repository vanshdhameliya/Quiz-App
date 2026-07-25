import React, { createContext, useContext, useEffect, useState } from 'react';
import adminApi, { getStoredAuthHeader, setStoredAuthHeader, clearStoredAuthHeader } from '../api/adminApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredAuthHeader());

  useEffect(() => {
    // If a request comes back 401 (e.g. credentials changed on the server),
    // adminApi fires this event so the whole app knows to log out.
    const handleExpired = () => setIsAuthenticated(false);
    window.addEventListener('admin-auth-expired', handleExpired);
    return () => window.removeEventListener('admin-auth-expired', handleExpired);
  }, []);

  const login = async (username, password) => {
    const header = 'Basic ' + btoa(`${username}:${password}`);
    try {
      // Validate the credentials against a real protected endpoint before
      // treating the user as logged in.
      await adminApi.get('/quizzes', { headers: { Authorization: header } });
      setStoredAuthHeader(header);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Invalid username or password.' };
    }
  };

  const logout = () => {
    clearStoredAuthHeader();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
