import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarMateria = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);
  const [error, setError] = useState(null);

  const fetchMateria = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/materias/${id}`);
    const data = await response.json();

    if (response.ok && data.success) {
      setValues(data.data);
    } else {
      setError("Error al cargar la materia.");
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchMateria();
  }, [fetchMateria]);

  const validarFormulario = async () => {
    const año = Number(values.año);

    // Año fuera de rango
    if (año < 1 || año > 6) {
      return "El año debe estar entre 1 y 6.";
    }

    // Obtener todas las materias
    const response = await fetchAuth("http://localhost:3000/materias");
    const data = await response.json();

    if (response.ok && data.success) {
      const materias = data.data;

      // Código duplicado (ignorando la misma materia)
      if (
        materias.some(
          (m) => m.id !== Number(id) && m.codigo == values.codigo
        )
      ) {
        return "El código ya está en uso. Ingrese otro.";
      }

      // Nombre duplicado (ignorando la misma materia)
      if (
        materias.some(
          (m) =>
            m.id !== Number(id) &&
            m.nombre.trim().toLowerCase() === values.nombre.trim().toLowerCase()
        )
      ) {
        return "El nombre de la materia ya está en uso.";
      }
    }

    return null; // Todo ok
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    const msg = await validarFormulario();
    if (msg) {
      setError(msg);
      return;
    }

    const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "Error al modificar la materia.");
      return;
    }

    navigate("/materias");
  };


  if (!values) {
    return <article aria-busy="true">Cargando datos de la materia...</article>;
  }

  return (
    <article>
      <h2>Modificar Materia</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
          </label>

          <label>
            Código
            <input
              required
              value={values.codigo}
              onChange={(e) => setValues({ ...values, codigo: e.target.value })}
            />
          </label>

          <label>
            Año
            <input
              type="number"
              required
              value={values.año}
              min={1}
              max={6}
              onChange={(e) => setValues({ ...values, año: e.target.value })}
            />
          </label>
        </fieldset>

        {error && (
          <p>
            <mark>{error}</mark>
          </p>
        )}

        <input type="submit" value="Guardar Cambios" />
      </form>
    </article>
  );
};
