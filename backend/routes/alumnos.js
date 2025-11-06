import express from "express"
import { db } from "../db.js"
import { validarId, validarAlumno, verificarValidaciones } from "./validaciones.js"

const router = express.Router()

// Obtener todos los alumnos
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM alumno")
  console.log("GET /alumnos:", rows)

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "No hay alumnos cargados" })
  }

  res.status(200).json({ success: true, data: rows })
})

// Obtener alumno por id
router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id)
  const [rows] = await db.query("SELECT * FROM alumno WHERE id = ?", [id])

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "Alumno no encontrado" })
  }

  res.status(200).json({ success: true, data: rows[0] })
})

// Crear nuevo alumno
router.post("/", validarAlumno, verificarValidaciones, async (req, res) => {
  const { nombre, apellido, dni } = req.body

  const [existe] = await db.query("SELECT * FROM alumno WHERE dni = ?", [dni])
  if (existe.length > 0) {
    return res.status(400).json({ success: false, message: "Ya existe un alumno con ese DNI" })
  }

  const [result] = await db.query(
    "INSERT INTO alumno (nombre, apellido, dni) VALUES (?, ?, ?)",
    [nombre, apellido, dni]
  )

  res.status(201).json({
    success: true,
    message: "Alumno creado correctamente",
    data: { id: result.insertId, nombre, apellido, dni },
  })
})

// Actualizar alumno por id
router.put("/:id", validarId, ...validarAlumno, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id)
  const { nombre, apellido, dni } = req.body

  const [rows] = await db.query("SELECT * FROM alumno WHERE id = ?", [id])
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "Alumno no encontrado" })
  }

  if (!nombre && !apellido && !dni) {
    return res.status(400).json({
      success: false,
      message: "Debe enviar al menos un campo para actualizar",
    })
  }

  const actualizado = {
    nombre: nombre ?? rows[0].nombre,
    apellido: apellido ?? rows[0].apellido,
    dni: dni ?? rows[0].dni,
  }

  await db.query(
    "UPDATE alumno SET nombre = ?, apellido = ?, dni = ? WHERE id = ?",
    [actualizado.nombre, actualizado.apellido, actualizado.dni, id]
  )

  res.status(200).json({
    success: true,
    message: "Alumno actualizado correctamente",
    data: { id, ...actualizado },
  })
})

// Eliminar alumno por id
router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id)

  const [rows] = await db.query("SELECT * FROM alumno WHERE id = ?", [id])
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "Alumno no encontrado" })
  }

  await db.query("DELETE FROM alumno WHERE id = ?", [id])
  res.status(200).json({ success: true, message: "Alumno eliminado correctamente" })
})

export default router
