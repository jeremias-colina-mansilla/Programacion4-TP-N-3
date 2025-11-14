import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

export function CrearNota() {
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const [listaAlumnos, setListaAlumnos] = useState([]);
  const [listaMaterias, setListaMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [nuevaNota, setNuevaNota] = useState({
    alumno_id: "",
    materia_id: "",
    nota1: "",
    nota2: "",
    nota3: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setMensajeError("");

        // Cargar alumnos
        const resAlumnos = await fetchAuth("http://localhost:3000/alumnos");
        const dataAlumnos = await resAlumnos.json();
        if (!resAlumnos.ok || !dataAlumnos.success) throw new Error("No se pudieron cargar los alumnos");
        setListaAlumnos(dataAlumnos.data);

        // Cargar materias
        const resMaterias = await fetchAuth("http://localhost:3000/materias");
        const dataMaterias = await resMaterias.json();
        if (!resMaterias.ok || !dataMaterias.success) throw new Error("No se pudieron cargar las materias");
        setListaMaterias(dataMaterias.data);

      } catch (err) {
        console.error(err);
        setMensajeError(err.message || "Error al cargar datos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [fetchAuth]);

  const handleChange = (e) => {
    setNuevaNota({ ...nuevaNota, [e.target.name]: e.target.value });
    setMensajeError("");
  };

  const validarNotas = () => {
    if (!nuevaNota.alumno_id) return "Debe seleccionar un alumno";
    if (!nuevaNota.materia_id) return "Debe seleccionar una materia";
    if (nuevaNota.nota1 === "") return "La Nota 1 es obligatoria";
    if (nuevaNota.nota2 === "") return "La Nota 2 es obligatoria";
    if (nuevaNota.nota3 === "") return "La Nota 3 es obligatoria";

    const n1 = parseFloat(nuevaNota.nota1);
    const n2 = parseFloat(nuevaNota.nota2);
    const n3 = parseFloat(nuevaNota.nota3);

    if (isNaN(n1) || n1 < 0 || n1 > 10) return "La Nota 1 debe estar entre 0 y 10";
    if (isNaN(n2) || n2 < 0 || n2 > 10) return "La Nota 2 debe estar entre 0 y 10";
    if (isNaN(n3) || n3 < 0 || n3 > 10) return "La Nota 3 debe estar entre 0 y 10";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorValidacion = validarNotas();
    if (errorValidacion) {
      setMensajeError(errorValidacion);
      return;
    }

    setEnviando(true);

    try {
      const res = await fetchAuth("http://localhost:3000/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumno_id: parseInt(nuevaNota.alumno_id),
          materia_id: parseInt(nuevaNota.materia_id),
          nota1: parseFloat(nuevaNota.nota1),
          nota2: parseFloat(nuevaNota.nota2),
          nota3: parseFloat(nuevaNota.nota3),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        navigate("/notas", { state: { mensaje: "Nota creada correctamente" } });
      } else {
        setMensajeError(data.message || "Error al crear la nota");
      }
    } catch (err) {
      console.error(err);
      setMensajeError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <p>Cargando alumnos y materias...</p>;

  return (
    <article>
      <h2>Crear Nota</h2>

      {mensajeError && <p style={{ color: "red" }}>{mensajeError}</p>}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={enviando}>
          <label>
            Alumno:
            <select
              name="alumno_id"
              value={nuevaNota.alumno_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un alumno</option>
              {listaAlumnos.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
              ))}
            </select>
          </label>

          <label>
            Materia:
            <select
              name="materia_id"
              value={nuevaNota.materia_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una materia</option>
              {listaMaterias.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            Nota 1:
            <input
              type="number"
              name="nota1"
              value={nuevaNota.nota1}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="10"
              required
            />
          </label>

          <label>
            Nota 2:
            <input
              type="number"
              name="nota2"
              value={nuevaNota.nota2}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="10"
              required
            />
          </label>

          <label>
            Nota 3:
            <input
              type="number"
              name="nota3"
              value={nuevaNota.nota3}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="10"
              required
            />
          </label>
        </fieldset>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <input type="submit" value={enviando ? "Creando..." : "Crear Nota"} disabled={enviando} />
          <button type="button" onClick={() => navigate("/notas")} disabled={enviando}>
            Cancelar
          </button>
        </div>
      </form>
    </article>
  );
}
