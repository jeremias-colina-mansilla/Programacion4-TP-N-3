import { useState } from "react";
import { useAuth } from "./Auth";
import { Link, useNavigate } from "react-router-dom";

export const Ingresar = () => {
  const { login, error } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      setOpen(false);
      setEmail("");
      setPassword("");
      navigate("/"); // redirige al inicio
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>

      {open && (
        <div className="login-modal-overlay" onClick={() => setOpen(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Ingrese usuario y contraseña</h2>
            <form onSubmit={handleSubmit}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="login-error">{error}</p>}
              <div className="login-buttons">
                <button type="button" className="secondary" onClick={() => setOpen(false)}>Cancelar</button>
                <button type="submit">Ingresar</button>
                <Link to="/usuarios/crear" className="contrast" onClick={() => setOpen(false)}>Registrarse</Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
