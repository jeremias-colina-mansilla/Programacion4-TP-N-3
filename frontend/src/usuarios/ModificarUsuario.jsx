import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

export function ModificarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();
  const [values, setValues] = useState({ nombre: "", email: "", password: "" });

  const fetchUsuario = useCallback(async () => {
    const res = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
    const data = await res.json();
    if (res.ok && data.success) setValues({ ...data.data, password: "" });
  }, [fetchAuth, id]);

useEffect(() => {
  const fetchDatos = async () => {
    await fetchUsuario();
  };
  fetchDatos();
}, [fetchUsuario]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok || !data.success) return alert("Error al modificar usuario contraseña invalida");
    navigate(`/usuarios/${id}`);
  };

  return (
    <article>
      <h2>Modificar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre
          <input value={values.nombre} onChange={e => setValues({ ...values, nombre: e.target.value })} required />
        </label>
        <label>Email
          <input type="email" value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} required />
        </label>
        <label>Contraseña
          <input type="password" value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} />
        </label>
        <button type="submit">Guardar Cambios</button>
      </form>
    </article>
  );
}
