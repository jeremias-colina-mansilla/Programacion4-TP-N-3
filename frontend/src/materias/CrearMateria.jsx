import { useState } from "react";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

export const CrearMateria = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nombre: "",
    codigo: "",
    año: 1,
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetchAuth("http://localhost:3000/materias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      setError(data.message || "Error al crear la materia");
      return;
    }

    navigate("/materias");
  };

  return (
    <article>
      <h2>Crear Nueva Materia</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre:
            <input
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
              required
            />
          </label>
          <label>
            Código:
            <input
              value={values.codigo}
              onChange={(e) => setValues({ ...values, codigo: e.target.value })}
              required
            />
          </label>
          <label>
            Año:
            <input
              type="number"
              value={values.año}
              onChange={(e) => setValues({ ...values, año: e.target.value })}
              required
            />
          </label>
        </fieldset>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="submit" value="Crear Materia" />
      </form>
    </article>
  );
};
