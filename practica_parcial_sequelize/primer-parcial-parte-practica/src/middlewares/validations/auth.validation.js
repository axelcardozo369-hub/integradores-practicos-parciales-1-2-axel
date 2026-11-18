// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

const roles = ["developer", "administrator"];
export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  body("username")
    .notEmpty()
    .withMessage("el username debe obligatorio")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("el username debe ser de al menos 3 a 20 caracteres")
    .bail()
    .custom(async (username) => {
      const idUserExiste = await UserModel.findOne({ where: { username } });
      if (idUserExiste) {
        throw new Error("el user ya existe");
      }
    }),
  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  body("email")
    .notEmpty()
    .withMessage("el email debe ser obligatorio")
    .bail()
    .isEmail()
    .withMessage("el email debe ser valido")
    .bail()
    .custom(async (email) => {
      const emailExiste = await UserModel.findOne({ where: { email: email } });
      if (emailExiste) {
        throw new Error("el email ya existe");
      }
    }),
  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  body("password")
    .notEmpty()
    .withMessage("el password debe ser obligatorio")
    .bail()
    .isLength({ min: 8 })
    .withMessage("el password debe ser minimo 8 caracteres"),
  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  body("role")
    .optional()
    .isIn(["developer", "administrator"])
    .withMessage(`el role debe al menos de ${roles}`),
  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  body("profile.employee_number")
    .notEmpty()
    .withMessage("el profile.employee_number debe ser obligatorio")
    .custom(async (employe_number) => {
      const nroEmpleadoExiste = await ProfileModel.findOne({
        where: { employee_number: employe_number },
      });
      if (nroEmpleadoExiste) {
        throw new Error("ya existe el numero del empleado");
      }
    }),
  // TODO: 6. Validar profile.first_name y profile.last_name
  // TODO:6 como obligatorios, y profile.phone como opcional.
  body("profile.first_name")
    .notEmpty()
    .withMessage("el first_name debe ser obligatorio"),
  body("profile.last_name")
    .notEmpty()
    .withMessage("el lastname debe ser obligatorio"),
  body("profile.phone")
    .optional()
    .notEmpty()
    .withMessage("el phone debe ser obligatorio"),
  // ? Las unicidades requieren una validación personalizada asíncrona.
];

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  body("email")
    .notEmpty()
    .withMessage("el email debe ser obligatorio")
    .bail()
    .isEmail()
    .withMessage("el email debe ser valido")
    .bail(),
  // TODO: 8. Validar password: obligatoria.
  body("password")
    .notEmpty()
    .withMessage("el password debe ser obligatorio")
    .bail()
    .isLength({ min: 8 })
    .withMessage("el password debe ser minimo 8 caracteres"),
];
