import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      setToken(data.token);
      setEmail(data.usuario.email);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) throw new Error("No está autenticado");
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  return (
    <AuthContext.Provider
      value={{ token, email, error, isAuthenticated: !!token, login, logout, fetchAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Componente para proteger rutas
export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <h2>Inicie sesión para continuar</h2>;
  return children;
};
