import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export function Notas() {
  const { fetchAuth } = useAuth();

  const [notas, setNotas] = useState([]);
  const [buscarAlumno, setBuscarAlumno] = useState("");
  const [buscarMateria, setBuscarMateria] = useState("");

  const cargarNotas = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (buscarAlumno) params.append("buscarAlumno", buscarAlumno);
      if (buscarMateria) params.append("buscarMateria", buscarMateria);

      const response = await fetchAuth(`http://localhost:3000/notas?${params}`);
      const data = await response.json();

      if (data.success) setNotas(data.data);
      else setNotas([]);
    } catch (err) {
      console.log("Error cargando notas:", err);
    }
  }, [buscarAlumno, buscarMateria, fetchAuth]);

  useEffect(() => {
    cargarNotas();
  }, [cargarNotas]);

  const eliminarNota = async (id) => {
    if (!confirm("¿Eliminar nota?")) return;
    try {
      const res = await fetchAuth(`http://localhost:3000/notas/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) cargarNotas();
      else alert(data.message);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <article>
      <h2>Notas</h2>

      <Link to="/notas/crear" className="contrast">Agregar Nota</Link>

      <h3>Buscar</h3>
      <div className="grid">
        <input
          value={buscarAlumno}
          onChange={(e) => setBuscarAlumno(e.target.value)}
          placeholder="Buscar alumno..."
        />
        <input
          value={buscarMateria}
          onChange={(e) => setBuscarMateria(e.target.value)}
          placeholder="Buscar materia..."
        />
      </div>

      <hr />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Notas</th>
            <th>Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.alumno_nombre} {n.alumno_apellido}</td>
              <td>{n.materia_nombre}</td>
              <td>
                {n.nota1 ?? "-"} / {n.nota2 ?? "-"} / {n.nota3 ?? "-"}
              </td>
              <td>{n.promedio ?? "-"}</td>
              <td>
                <Link to={`/notas/${n.id}/modificar`}>Modificar</Link>
                {" "}
                <button className="secondary" onClick={() => eliminarNota(n.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
