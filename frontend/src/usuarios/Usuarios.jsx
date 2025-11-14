// src/usuarios/Usuarios.jsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export function Usuarios() {
  const { fetchAuth } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchUsuarios = useCallback(
    async (buscarTerm = "") => {
      try {
        const params = new URLSearchParams();
        if (buscarTerm) params.append("buscar", buscarTerm);

        const response = await fetchAuth(
          "http://localhost:3000/usuarios" +
            (params.size > 0 ? "?" + params.toString() : "")
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          setUsuarios([]);
          return;
        }

        setUsuarios(data.data || []);
      } catch (error) {
        console.error(error);
        setUsuarios([]);
      }
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleBuscar = () => {
    fetchUsuarios(buscar);
  };

  // Quitar usuario
  const handleQuitar = async (id) => {
    if (!window.confirm("¿Desea eliminar el usuario?")) return;
    const res = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) return alert("Error al eliminar usuario");
    fetchUsuarios(buscar);
  };

  return (
    <article className="usuarios-container">
      <h2>Usuarios</h2>
      <div className="usuarios-actions">
        <Link className="btn" to="/usuarios/crear">
          Nuevo usuario
        </Link>
        <div className="buscar">
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar por nombre o email..."
          />
          <button className="btn" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <div className="acciones">
                    <Link className="btn small" to={`/usuarios/${u.id}/modificar`}>
                      Modificar
                    </Link>
                    <button className="btn small danger" onClick={() => handleQuitar(u.id)}>
                      Quitar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay usuarios para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </article>
  );
}
