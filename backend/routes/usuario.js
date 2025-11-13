import express from "express";
import { db } from "../db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();



// Obtener todos los usuarios (sin mostrar contraseñas)
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.query("SELECT id, nombre, email FROM usuario");
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "No hay usuarios" });
  }
  res.json({ success: true, data: rows });
});

// Obtener un usuario por ID
router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.query("SELECT id, nombre, email FROM usuario WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "Usuario no encontrado" });
  }
  res.json({ success: true, data: rows[0] });
});

// Crear un nuevo usuario
router.post(
  "/",
  body("nombre").isString().isLength({ min: 2, max: 100 }),
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;

    const [existe] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (existe.length > 0) {
      return res.status(400).json({ success: false, message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: { id: result.insertId, nombre, email },
    });
  }
);



// Actualizar usuario por ID
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre").optional().isString().isLength({ min: 2, max: 100 }),
  body("email").optional().isEmail(),
  body("password").optional().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM usuario WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const actual = rows[0];
    const updatedUser = {
      nombre: nombre ?? actual.nombre,
      email: email ?? actual.email,
      password: password ? await bcrypt.hash(password, 10) : actual.password,
    };

    await db.query("UPDATE usuario SET nombre=?, email=?, password=? WHERE id=?", [
      updatedUser.nombre,
      updatedUser.email,
      updatedUser.password,
      id,
    ]);

    res.json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: { id, nombre: updatedUser.nombre, email: updatedUser.email },
    });
  }
);


// Eliminar usuario por ID
router.delete("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [result] = await db.query("DELETE FROM usuario WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Usuario no encontrado" });
  }
  res.json({ success: true, message: "Usuario eliminado correctamente" });
});
export default router;