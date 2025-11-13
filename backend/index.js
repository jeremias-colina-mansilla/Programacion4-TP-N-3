import express from "express"
import { conectarDB } from "./db.js"
import cors from "cors"
import passport from "passport"
import { authConfig } from "./routes/auth.js"
import materiaRoutes from "./routes/materias.js"
import alumnosRoutes from "./routes/alumnos.js"
import usuariosRoutes from "./routes/usuario.js"
import authRoutes from "./routes/auth.js"
import notasRoutes from "./routes/notas.js"

conectarDB();

const app = express();
const port = 3000;


app.use(express.json())
app.use(cors())

authConfig();
app.use(passport.initialize())

app.use("/materias", materiaRoutes)
app.use("/alumnos", alumnosRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/notas", notasRoutes)
app.use("/auth", authRoutes)


app.get("/", (req, res)=>{
    res.send("notas para los alumnos")
})


// Middleware para manejar errores del servidor (500)
app.use((err, req, res, next) => {
  console.error("🔥 Error interno del servidor:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor. Intente nuevamente más tarde.",
  });
});

app.listen(port, ()=>{
    console.log(`la aplicacion esta funcionando en el puerto ${port}`)
})