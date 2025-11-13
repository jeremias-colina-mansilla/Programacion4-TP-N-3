import express from "express";
import { db } from "../db.js";
import { verificarAutenticacion } from "./auth.js";
import { validarNota, validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

// 🔐 Proteger todas las rutas
router.use(verificarAutenticacion);

// 📘 GET Obtener notas 
router.get("/", async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      n.id,
      n.alumno_id,
      n.materia_id,
      n.nota1,
      n.nota2,
      n.nota3,
      ROUND((n.nota1 + n.nota2 + n.nota3) / 3, 2) AS promedio,
      a.nombre AS alumno_nombre,
      a.apellido AS alumno_apellido,
      m.nombre AS materia_nombre
    FROM nota n
    JOIN alumno a ON n.alumno_id = a.id
    JOIN materia m ON n.materia_id = m.id
  `);

  if (!rows.length) {
    return res.status(404).json({ success: false, message: "No hay notas registradas." });
  }

  res.json({ success: true, data: rows });
});

// 
// GET /notas/:id 
router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.execute(
    `
    SELECT 
      n.*, 
      ROUND((n.nota1 + n.nota2 + n.nota3) / 3, 2) AS promedio,
      a.nombre AS alumno_nombre,
      m.nombre AS materia_nombre
    FROM nota n
    JOIN alumno a ON n.alumno_id = a.id
    JOIN materia m ON n.materia_id = m.id
    WHERE n.id = ?
    `,
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: "Nota no encontrada." });
  }

  res.json({ success: true, data: rows[0] });
});

//  POST /notas 
router.post("/", validarNota, verificarValidaciones, async (req, res) => {
  const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

  const [alumno] = await db.execute("SELECT id FROM alumno WHERE id = ?", [alumno_id]);
  if (alumno.length === 0) {
    return res.status(400).json({ success: false, message: "El alumno no existe." });
  }

  const [materia] = await db.execute("SELECT id FROM materia WHERE id = ?", [materia_id]);
  if (materia.length === 0) {
    return res.status(400).json({ success: false, message: "La materia no existe." });
  }

  const [existe] = await db.execute(
    "SELECT id FROM nota WHERE alumno_id = ? AND materia_id = ?",
    [alumno_id, materia_id]
  );

  if (existe.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Ya existen notas para este alumno en esta materia.",
    });
  }

  const [result] = await db.execute(
    "INSERT INTO nota (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)",
    [alumno_id, materia_id, nota1, nota2, nota3]
  );

  res.status(201).json({
    success: true,
    message: "Nota creada correctamente.",
    data: { id: result.insertId, alumno_id, materia_id, nota1, nota2, nota3 },
  });
});

//  PUT /notas/:id 
router.put("/:id", [validarId, ...validarNota], verificarValidaciones, async (req, res) => {
  const { id } = req.params;
  const { nota1, nota2, nota3 } = req.body;

  const [nota] = await db.execute("SELECT id FROM nota WHERE id = ?", [id]);
  if (nota.length === 0) {
    return res.status(404).json({ success: false, message: "Nota no encontrada." });
  }

  const [result] = await db.execute(
    "UPDATE nota SET nota1 = ?, nota2 = ?, nota3 = ? WHERE id = ?",
    [nota1, nota2, nota3, id]
  );

  res.json({
    success: true,
    message: "Nota actualizada correctamente.",
    data: { id, nota1, nota2, nota3 },
  });
});

//  DELETE /notas/:id 
router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
  const { id } = req.params;

  const [nota] = await db.execute("SELECT id FROM nota WHERE id = ?", [id]);
  if (nota.length === 0) {
    return res.status(404).json({ success: false, message: "Nota no encontrada." });
  }

  //  Eliminar
  const [result] = await db.execute("DELETE FROM nota WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return res.status(400).json({ success: false, message: "Error al eliminar la nota." });
  }

  res.json({ success: true, message: "Nota eliminada correctamente." });
});

export default router;
