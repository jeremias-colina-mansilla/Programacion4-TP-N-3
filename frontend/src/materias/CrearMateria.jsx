import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

export const CrearMateria = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    nombre: "",
    codigo: "",
    año: new Date().getFullYear(),
  });

  const [error, setError] = useState(null);

  // 👉 Función para validar antes de enviar
  const validarFormulario = async () => {
    const año = Number(values.año);

    // Año no válido
    if (año < 1 || año > 6) {
      return "El año debe ser entre 1 y 6.";
    }

    // Consultar todas las materias
    const response = await fetchAuth("http://localhost:3000/materias");
    const data = await response.json();

    if (response.ok && data.success) {
      const materias = data.data;

      // Código duplicado
      if (materias.some((m) => m.codigo == values.codigo)) {
        return "El código ya está en uso. Ingrese otro.";
      }

      // Nombre duplicado
      if (materias.some((m) => m.nombre.trim().toLowerCase() === values.nombre.trim().toLowerCase())) {
        return "El nombre de la materia ya existe.";
      }
    }

    return null; // todo ok
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 👉 Ejecutar validaciones
    const mensajeError = await validarFormulario();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    const response = await fetchAuth("http://localhost:3000/materias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "Error al crear la materia.");
      return;
    }

    navigate("/materias");
  };

  return (
    <article>
      <h2>Registrar Nueva Materia</h2>

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
              onChange={(e) => setValues({ ...values, año: e.target.value })}
              min={1}
              max={6}
            />
          </label>
        </fieldset>

        {error && (
          <p>
            <mark>{error}</mark>
          </p>
        )}

        <input type="submit" value="Registrar Materia" />
      </form>
    </article>
  );
};
