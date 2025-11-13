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
      <dialog open={open}>
        <article>
          <h2>Ingrese usuario y contraseña</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
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
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Ingresar" />
                <Link
                  to="/usuarios/crear"
                  role="button"
                  className="contrast"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};
