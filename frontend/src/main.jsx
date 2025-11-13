import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout.jsx";
import { AuthProvider, AuthPage } from "./Auth.jsx";

import { Usuarios } from "./Usuarios.jsx";
import { Alumnos } from "./Alumnos.jsx";
import { Materias } from "./Materias.jsx"
import { Notas } from "./Notas.jsx";

import { Ingresar } from "./Ingresar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Página de inicio */}
            <Route index element={<AuthPage><div>Bienvenido a la aplicación</div></AuthPage>} />

            {/* Página de login pública */}
            <Route path="login" element={<Ingresar />} />

            {/* Rutas protegidas */}
            <Route path="usuarios" element={<AuthPage><Usuarios /></AuthPage>} />
            <Route path="alumnos" element={<AuthPage><Alumnos /></AuthPage>} />
            <Route path="materias" element={<AuthPage><Materias /></AuthPage>} />
            <Route path="notas" element={<AuthPage><Notas /></AuthPage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
