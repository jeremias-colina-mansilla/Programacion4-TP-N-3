import express from "express"
import { db } from "../db.js"
import { validarId, verificarValidaciones } from "./validaciones.js"
import { body, param } from "express-validator"
const router = express.Router()



// obtener todas la materias
router.get("/", async(req, res)=>{
    const [rows] = await db.query("SELECT * FROM materia");
    console.log("GET /materias:", rows)

    if (rows.length ===0){
        return res.status(404).json({success: false, message: "No hay materias cargadas"})
    }
    return res.status(200).json({success: true, data: rows})
})

//obtener materia por id
router.get(
    "/:id",
    validarId,
    verificarValidaciones, 
    async (req, res)=>{
        const id = Number(req.params.id);
        const [rows] = await db.query("SELECT * FROM materia WHERE id = ?", [id]);

        if (rows.length === 0 ) {
            return res.status(404)
            .json({success: false, message:"Materia no encontrada"})
        }
        res.status(200).json({success: true, data: rows[0]})
    }
)



//post para crear las materias
router.post(
    "/",
    body("nombre").isString().isLength({min: 3, max: 100}),
    body("codigo").isInt({min: 1}),
    body("año").isInt({min: 1, max: 6}),
    verificarValidaciones, async (req, res)=>{
        const {nombre, codigo, año }= req.body;

        const [existe] = await db.query(
            "SELECT * FROM materia WHERE codigo = ? or nombre = ?",
            [codigo, nombre]
        );
        if (existe.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una materia con ese nombre o codigo",
            })
        }
 

        const [result] = await db.query(
            "INSERT INTO materia (nombre, codigo, año) VALUES (?,?,?)",
            [nombre, codigo, año]
        );
        res.status(201).json({
            success: true,
            data: {id: result.insertId, nombre, codigo, año}
        })
    }
)


// Actualizar una materia por id
router.put(
    "/:id",
    validarId,
    body("nombre").optional().isString().isLength({min: 3, max: 100}),
    body("codigo").optional().isInt({min: 1 }),
    body("año").optional().isInt({min: 1, max: 6}),
    verificarValidaciones,
    async (req, res)=>{
        const id = Number(req.params.id);
        const { nombre, codigo, año } = req.body;


        const [rows] = await db.query(
            "SELECT * FROM materia WHERE id = ?", [id]);

        if (!nombre && !codigo && !año){
            return res.status(400).json({
                success: false,
                message: "Debe enviar almenos un campos para actualizar "
            })
        }

        if (rows.length === 0 ) {
            return res.status(404)
            .json({success:false, message: "Materia no encontrada"})
        }
        
        
        await db.query(
            "UPDATE materia SET nombre = ?, codigo = ?, año = ? WHERE id = ?",
            [
                nombre ?? rows[0].nombre,
                codigo ?? rows[0].codigo,
                año ?? rows[0].año,
                id,
            ]
        );
        res.status(200).json({
            success: true,
            message: "Materia actualizada correctamente",
            data: {id, nombre: nombre ?? rows[0].nombre,
                    codigo: codigo ?? rows[0].codigo,
                    año: año ?? rows[0].año }
        });
    }
);


//Eliminar una materia por id 
router.delete(
    "/:id",
    validarId,
    verificarValidaciones,
    async (req, res )=>{
        const id = Number(req.params.id);

        const [rows]= await db.query("SELECT * FROM materia WHERE id = ?", [id]);
        if (rows.length === 0){
            return res.status(404)
            .json({success: false, message: "Materia no encontrada"});
        }
        await db.query("DELETE FROM materia WHERE id = ?", [id])
        res.status(200).json({
            success: true,
            message: "Materia eliminada correctamente"
        })
    }
)


export default router