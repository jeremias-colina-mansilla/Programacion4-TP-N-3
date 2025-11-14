import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

export function CrearUsuario() {
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // limpiar errores al cambiar
  };

  const validar = () => {
    if (!form.nombre) return "El nombre es obligatorio";
    if (!form.email) return "El email es obligatorio";
    if (!form.password) return "La contraseña es obligatoria";
    // Puedes agregar validación de email o password más estricta aquí
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchAuth("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate("/usuarios");
      } else {
        // Mostrar mensaje del backend si existe
        setError(data.message || "Error al crear el usuario");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Crear Usuario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
}
