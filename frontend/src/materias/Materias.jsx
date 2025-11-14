import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export function Materias() {
  const { fetchAuth } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [mostrarMaterias, setMostrarMaterias] = useState(true);

  const fetchMaterias = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/materias");
      const data = await response.json();

      if (response.ok && data.success) {
        setMaterias(data.data || []);
      } else {
        console.error("Error al cargar materias:", data.message);
        setMaterias([]);
      }
    } catch (error) {
      console.error("Error de red al cargar materias:", error);
      setMaterias([]);
    }
  }, [fetchAuth]);

  // Se usa async function dentro de useEffect para evitar warnings de React
  useEffect(() => {
    const loadMaterias = async () => {
      await fetchMaterias();
    };
    loadMaterias();
  }, [fetchMaterias]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok && data.success) {
          fetchMaterias();
        } else {
          window.alert(data.message || "Error al eliminar la materia");
        }
      } catch (error) {
        console.error("Error al eliminar materia:", error);
        window.alert("Error al eliminar la materia");
      }
    }
  };

  return (
    <article>
      <h2>Gestión de Materias</h2>
      <Link role="button" to="/materias/crear">Nueva Materia</Link>
      <button
        onClick={() => setMostrarMaterias(!mostrarMaterias)}
        className="contrast"
        style={{ margin: "1rem 0" }}
      >
        {mostrarMaterias ? "Ocultar Lista" : "Mostrar Lista"}
      </button>

      {mostrarMaterias && (
        <table>
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
            {materias.map((m, index) => (
              <tr key={`${m.id_materia}-${index}`}>
                <td>{m.id_materia}</td>
                <td>{m.nombre}</td>
                <td>{m.codigo}</td>
                <td>{m.año}</td>
                <td>
                  <Link
                    role="button"
                    to={`/materias/${m.id_materia}/modificar`}
                  >
                    Modificar
                  </Link>{" "}
                  <button
                    className="secondary"
                    onClick={() => handleQuitar(m.id_materia)}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}
