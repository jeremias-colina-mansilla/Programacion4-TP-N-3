import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./Auth";
import { Ingresar } from "./Ingresar";

export const Layout = () => {
  const { isAuthenticated, logout, email } = useAuth();

  return (
    <>
      <header>
        <h1>Mi Aplicación</h1>
        {isAuthenticated ? (
          <>
            <span>Hola, {email}</span>
            <button onClick={logout}>Cerrar sesión</button>
            <nav>
              <Link to="/usuarios">Usuarios</Link>
              <Link to="/alumnos">Alumnos</Link>
              <Link to="/materias">Materias</Link>
              <Link to="/notas">Notas</Link>
            </nav>
          </>
        ) : (
          <>
            <span>No has iniciado sesión</span>
            <Ingresar />
          </>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
