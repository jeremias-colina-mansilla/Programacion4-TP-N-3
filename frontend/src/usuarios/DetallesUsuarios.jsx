import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

export function DetallesUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();
  const [usuario, setUsuario] = useState(null);

  const fetchUsuario = useCallback(async () => {
    const res = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
    const data = await res.json();
    if (res.ok && data.success) setUsuario(data.data);
    else console.error(data.error);
  }, [fetchAuth, id]);

useEffect(() => {
  const fetchDatos = async () => {
    await fetchUsuario();
  };
  fetchDatos();
}, [fetchUsuario]);
  const handleQuitar = async () => {
    if (!window.confirm("¿Desea eliminar el usuario?")) return;
    const res = await fetchAuth(`http://localhost:3000/usuarios/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) return alert("Error al eliminar usuario");
    navigate("/usuarios");
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <article>
      <h2>Detalles de Usuario</h2>
      <p>ID: {usuario.id}</p>
      <p>Nombre: {usuario.nombre}</p>
      <p>Email: {usuario.email}</p>
      <div>
        <Link to={`/usuarios/${id}/modificar`}>Modificar</Link>
        <button onClick={handleQuitar}>Eliminar</button>
        <Link to="/usuarios">Volver</Link>
      </div>
    </article>
  );
}
