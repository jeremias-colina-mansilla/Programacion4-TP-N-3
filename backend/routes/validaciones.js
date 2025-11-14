import { body, param, validationResult } from "express-validator";

export const validarId = param("id").isInt({ min: 1 });

// Middleware verifaciones
export const verificarValidaciones = (req, res, next) => {
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Falla de validacion",
      errores: validacion.array(),
    });
  }
  next();
};


export const validarAlumno = [
  body("nombre").isString().withMessage("El nombre debe ser texto")
  .isLength({min:2, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  body("apellido").isString().withMessage("El apellido debe ser texto")
  .isLength({min:2, max: 50 }).withMessage("El apellido debe tener entre 3 y 50 caracteres"),
  body("dni").isString().withMessage("El dni debe ser texto")
  .isLength({min: 7, max: 8}).withMessage("El dni debe tener entre 7 y 8 caracteres"),

];


export const validarNota= [
  body("alumno_id").isInt({min: 1}),
  body("materia_id").isInt({min:1}),
  body("nota1").isFloat({min: 0, max: 10}).withMessage("La nota 1 debe ser un numero entre 0 y 10"),
  body("nota2").isFloat({min: 0, max: 10}).withMessage("La nota 1 debe ser un numero entre 0 y 10"),
  body("nota3").isFloat({min: 0, max: 10}).withMessage("La nota 1 debe ser un numero entre 0 y 10"),
]

export const validarNotaActualizar = [
  body("nota1").isFloat({ min: 0, max: 10 }).withMessage("La nota 1 debe estar entre 0 y 10."),
  body("nota2").isFloat({ min: 0, max: 10 }).withMessage("La nota 2 debe estar entre 0 y 10."),
  body("nota3").isFloat({ min: 0, max: 10 }).withMessage("La nota 3 debe estar entre 0 y 10."),
];