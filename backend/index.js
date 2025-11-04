import express from "express"
import { conectarDB } from "./db.js"
import cors from "cors"


conectarDB();

const app = express();
const port = 3000;


app.use(express.json())


app.use(cors())


app.get("/", (req, res)=>{
    res.send("notas para los alumnos")
})




app.listen(port, ()=>{
    console.log(`la aplicacion esta funcionando en el puerto ${port}`)
})