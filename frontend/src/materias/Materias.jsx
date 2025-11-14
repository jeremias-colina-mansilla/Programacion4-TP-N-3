import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export function Materias() {
  const { fetchAuth } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [buscar, setBuscar] = useState("");

  const cargarMaterias = useCallback(async (query) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append("buscar", query);

      const response = await fetchAuth(
        `http://localhost:3000/materias?${params.toString()}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMaterias(data.data);
      } else {
        console.error("Error:", data.message);
        setMaterias([]);
      }
    } catch (error) {
      console.error("Error al cargar materias:", error);
    }
  }, [fetchAuth]);

  useEffect(() => {
    cargarMaterias(buscar);
  }, [cargarMaterias, buscar]);

  const eliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta materia?")) {
      const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        cargarMaterias(buscar);
      } else {
        alert(data.message || "Error al eliminar");
      }
    }
  };

  return (
    <article>
      <h2>Gestión de Materias</h2>

      <Link role="button" to="/materias/crear">
        Nueva Materia
      </Link>

      <input
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        placeholder="Buscar por nombre o código..."
        style={{ marginTop: "1rem" }}
      />

      <table style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {materias.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.codigo}</td>
              <td>{m.año}</td>
              <td>
                <Link role="button" to={`/materias/${m.id}/modificar`}>
                  Modificar
                </Link>
                <button className="secondary" onClick={() => eliminar(m.id)}>
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
