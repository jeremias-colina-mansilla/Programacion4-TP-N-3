import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate, useParams } from "react-router-dom";

export function ModificarNota() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [notaActual, setNotaActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const cargarNota = async () => {
      try {
        setCargando(true);
        const res = await fetchAuth(`http://localhost:3000/notas/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Error al cargar la nota");
        }

        setNotaActual(data.data);
      } catch (err) {
        console.error("Error al cargar la nota:", err);
        setMensajeError(err.message || "No se pudo cargar la nota");
      } finally {
        setCargando(false);
      }
    };

    cargarNota();
  }, [fetchAuth, id]);

  const handleChange = (e) => {
    setNotaActual({ ...notaActual, [e.target.name]: e.target.value });
    setMensajeError("");
  };

  const validarNotas = () => {
    if (notaActual.nota1 === "") return "La Nota 1 es obligatoria.";
    if (notaActual.nota2 === "") return "La Nota 2 es obligatoria.";
    if (notaActual.nota3 === "") return "La Nota 3 es obligatoria.";

    const n1 = parseFloat(notaActual.nota1);
    const n2 = parseFloat(notaActual.nota2);
    const n3 = parseFloat(notaActual.nota3);

    if (n1 < 0 || n1 > 10) return "La Nota 1 debe estar entre 0 y 10.";
    if (n2 < 0 || n2 > 10) return "La Nota 2 debe estar entre 0 y 10.";
    if (n3 < 0 || n3 > 10) return "La Nota 3 debe estar entre 0 y 10.";

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
    setMensajeError("");

    try {
      const res = await fetchAuth(`http://localhost:3000/notas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nota1: parseFloat(notaActual.nota1),
          nota2: parseFloat(notaActual.nota2),
          nota3: parseFloat(notaActual.nota3),
        }),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      if (res.ok && data.success) {
        navigate("/notas", { state: { mensaje: "Nota modificada correctamente" } });
      } else {
        setMensajeError(data.message || "Error al modificar la nota");
      }
    } catch (err) {
      console.error("Error:", err);
      setMensajeError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <article aria-busy="true">Cargando nota...</article>;

  return (
    <article>
      <h2>Modificar Nota</h2>

      {mensajeError && (
        <div role="alert" style={{ marginBottom: "1rem" }}>
          <mark>{mensajeError}</mark>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={enviando}>
          <label>
            Nota 1:
            <input
              type="number"
              name="nota1"
              value={notaActual.nota1 ?? ""}
              step="0.01"
              min="0"
              max="10"
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </label>

          <label>
            Nota 2:
            <input
              type="number"
              name="nota2"
              value={notaActual.nota2 ?? ""}
              step="0.01"
              min="0"
              max="10"
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </label>

          <label>
            Nota 3:
            <input
              type="number"
              name="nota3"
              value={notaActual.nota3 ?? ""}
              step="0.01"
              min="0"
              max="10"
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </label>
        </fieldset>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <input
            type="submit"
            value={enviando ? "Guardando..." : "Guardar cambios"}
            disabled={enviando}
          />
          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/notas")}
            disabled={enviando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </article>
  );
}
