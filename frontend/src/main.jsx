import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { AuthProvider, AuthPage } from "./Auth";
import { Layout } from "./Layout";

// Usuarios
import { Usuarios } from "./usuarios/Usuarios";
import { CrearUsuario } from "./usuarios/CrearUsuario";
import { ModificarUsuario } from "./usuarios/ModificarUsuario";

// Alumnos
import { Alumnos } from "./alumnos/Alumnos";
import { CrearAlumno } from "./alumnos/CrearAlumno";
import { ModificarAlumno } from "./alumnos/ModificarAlumno";

// Materias
import { Materias } from "./materias/Materias";
import { CrearMateria } from "./materias/CrearMateria";
import { ModificarMateria } from "./materias/ModificarMateria";

// Notas
import { Notas } from "./notas/Notas";
import { CrearNota } from "./notas/CrearNotas";
import { ModificarNota } from "./notas/ModificarNotas";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            
            <Route index element={<AuthPage><h2>Bienvenido</h2></AuthPage>} />

            {/* Usuarios */}
            <Route path="usuarios" element={<AuthPage><Usuarios /></AuthPage>} />
            <Route path="usuarios/crear" element={<AuthPage><CrearUsuario /></AuthPage>} />
            <Route path="usuarios/:id/modificar" element={<AuthPage><ModificarUsuario /></AuthPage>} />

            {/* Alumnos */}
            <Route path="alumnos" element={<AuthPage><Alumnos /></AuthPage>} />
            <Route path="alumnos/crear" element={<AuthPage><CrearAlumno /></AuthPage>} />
            <Route path="alumnos/:id/modificar" element={<AuthPage><ModificarAlumno /></AuthPage>} />

            {/* Materias */}
            <Route path="materias" element={<AuthPage><Materias /></AuthPage>} />
            <Route path="materias/crear" element={<AuthPage><CrearMateria /></AuthPage>} />
            <Route path="materias/:id/modificar" element={<AuthPage><ModificarMateria /></AuthPage>} />

            {/* Notas */}
            <Route path="notas" element={<AuthPage><Notas /></AuthPage>} />
            <Route path="notas/crear" element={<AuthPage><CrearNota /></AuthPage>} />
            <Route path="notas/:id/modificar" element={<AuthPage><ModificarNota /></AuthPage>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
