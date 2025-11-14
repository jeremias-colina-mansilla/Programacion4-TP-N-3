import { useState } from "react";
import { useAuth } from "./Auth";

export const Ingresar = () => {
  const { login } = useAuth();

  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState("login"); // "login" o "registro"
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (modo === "login") {
      const result = await login(email, password);
      if (result.success) {
        setOpen(false);
        resetForm();
      } else {
        setError(result.message || "Error al iniciar sesión");
      }
    } else {
      if (!nombre || !email || !password || !confirmPassword) {
        setError("Todos los campos son obligatorios");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert("Usuario registrado correctamente, ahora puede iniciar sesión");
          setModo("login");
          resetForm();
        } else {
          setError(data.message || "Error al registrarse");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
      }
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>

      {open && (
        <div className="login-modal-overlay" onClick={() => { setOpen(false); resetForm(); }}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modo === "login" ? "Ingrese usuario y contraseña" : "Registro de usuario"}</h2>
            <form onSubmit={handleSubmit}>
              {modo === "registro" && (
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {modo === "registro" && (
                <div className="form-group">
                  <label>Confirmar contraseña:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {error && <p className="error-message">{error}</p>}

              <div className="buttons">
                <button type="button" className="btn-secondary" onClick={() => { setOpen(false); resetForm(); }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {modo === "login" ? "Ingresar" : "Registrarse"}
                </button>
              </div>

              <div className="register-link">
                <button type="button" onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); }}>
                  {modo === "login" ? "Crear cuenta" : "Volver a ingresar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
