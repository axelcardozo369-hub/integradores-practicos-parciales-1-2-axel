// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

const estados = ["planning", "in_progress", "paused", "finished"];
export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .notEmpty()
    .withMessage("el code debe ser obligatorio")
    .bail()
    .custom(async (unicoCode) => {
      const codeExist = await ProjectModel.findOne({ unicoCode });

      if (codeExist) {
        throw new Error("el code que quieres agregar ya existe ");
      }
    }),
  // TODO: 2. Validar name y description como obligatorios.
  body("name").notEmpty().withMessage("el name debe ser obligatorio"),
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.

  body("status")
    .optional()
    .isIn(["planning", "in_progress", "paused", "finished"])
    .withMessage(`el status deber almenos de ${estados}`),

  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date")
    .notEmpty()
    .withMessage("el start_date debe ser obligatorio")
    .bail()
    .isDate()
    .withMessage("el start_date debe ser de formato valido"),
  body("budget")
    .notEmpty()
    .withMessage("el bugdet debe ser obligatorio")
    .bail()
    .isFloat({ $gt: 0 })
    .withMessage("el bugdet debe ser mayor a 0"),
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  body("leader_id").custom(async (id) => {
    const userExist = await UserModel.findByPk(id);
    if (!userExist) {
      throw new Error("el usuario no existe");
    }
  }),
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  body("technologies")
    .isArray()
    .withMessage("technologies deber ser una lista"),
  body("technologies.*")
    .isInt({ min: 1 })
    .withMessage("cada technologies debe ser valida")
    .bail()
    .custom(async (id) => {
      const technologie = await TechnologyModel.findByPk(id);
      if (!technologie) {
        throw new Error(`la technologie con id ${id} no existe`);
      }
    }),
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional()
    .custom(async (code, { req }) => {
      const codeExist = await ProjectModel.findOne({ where: { code: code } });
      if (codeExist && codeExist.id !== Number(req.params.id)) {
        throw new Error("este code ya existe");
      }
    }),
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  body("name").optional().notEmpty().withMessage("el name no puede ser vacia"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("la description no debe ser vacia"),
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  body("status")
    .optional()
    .isIn(["planning", "in_progress", "paused", "finished"])
    .withMessage(`los estados debe ser alguno como ${estados}`),
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  body("leader_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("el id debe ser valido")
    .custom(async (idUser) => {
      const userExist = await UserModel.findByPk(idUser);
      if (!userExist) {
        throw new Error("el user no existe");
      }
    }),

  // TODO: 11. Validar technologies como opcional, con ids que existan.
  body("technologie")
    .optional()
    .isArray()
    .withMessage("technologies debe ser entre  una lista de arreglos"),
  body("tecnologies.*")
    .isInt({ min: 1 })
    .withMessage("cada id de technologie debe ser validos")
    .bail()

    .custom(async (id) => {
      const technology = await TechnologyModel.findByPk({ id });
      if (!technology) {
        throw new Error(`la technology de id ${id} no existe`);
      }
    }),

  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];
