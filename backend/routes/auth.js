import express from "express";
import { db } from "../db.js"
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const app = express.Router();


export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    })
  );
}

// Middleware para rutas protegidas
export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// Login
app.post(
  "/login",
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").isLength({ min: 6 }).withMessage("Contraseña mínima de 6 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    
    const [usuarios] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);

    if (usuarios.length === 0) {
      return res.status(400).json({ success: false, error: "Usuario no encontrado" });
    }

    const usuario = usuarios[0];
    
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(400).json({ success: false, error: "Contraseña incorrecta" });
    }

    
    const payload = { userId: usuario.id, email: usuario.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      expira_en: "4h",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  }
);

export default app;
