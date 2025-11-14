import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CrearUsuario() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);
    const res = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      if (res.status === 400) return setErrores(data.errores);
      return alert("Error al crear usuario");
    }
    navigate("/usuarios");
  };

  return (
    <article>
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre
          <input value={values.nombre} onChange={e => setValues({ ...values, nombre: e.target.value })} required />
        </label>
        <label>Email
          <input type="email" value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} required />
        </label>
        <label>Contraseña
          <input type="password" value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} required />
        </label>
        {errores && <small>{JSON.stringify(errores)}</small>}
        <button type="submit">Crear Usuario</button>
      </form>
    </article>
  );
}
