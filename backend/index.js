import express from "express"
import { conectarDB } from "./db.js"
import cors from "cors"

import materiaRoutes from "./routes/materias.js"
conectarDB();

const app = express();
const port = 3000;


app.use(express.json())


app.use(cors())

app.use("/materias", materiaRoutes)

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