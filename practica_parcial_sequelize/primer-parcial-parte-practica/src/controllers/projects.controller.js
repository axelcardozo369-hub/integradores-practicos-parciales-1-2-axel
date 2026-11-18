// * ARCHIVO A COMPLETAR
import { matchedData } from "express-validator";
import {
  ProjectModel,
  ProjectTechnologyModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    const validationData = matchedData(req, { locations: ["body"] });
    // ? Revisar de dónde debe salir el leader del proyecto.
    // TODO: 2. Asociar al project las technologies recibidas.
    const newProject = await ProjectModel.create(validationData);
    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
    return res
      .status(201)
      .json({ message: "project creado con exito", data: newProject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password)
    // TODO:1 y sus technologies, y responder con código 200 y los projects..
    const todayProjects = await ProjectModel.findAll({
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        {
          model: TechnologyModel,
          as: "technologies",
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "estos son todos los proyectos", data: todayProjects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
    const IdProject = await ProjectModel.findAll({
      where: { leader_id: req.user.id },
      include: {
        model: TechnologyModel,
        as: "technologies",
      },
    });

    return res.status(200).json({
      message: "project encontrado",
      data: IdProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    // TODO: 1. Actualizar el project con los datos recibidos.
    const validationData = matchedData(req, { locations: ["body"] });

    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    const project = await ProjectModel.findByPk(req.params.id);

    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
    // return res.status(200).json({message:"project actualizado",data:})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
    const { id } = req.params;
    const projectExiste = await ProjectModel.findByPk(id);
    await projectExiste.destroy();

    return res
      .status(204)
      .json({ message: "project eliminado", data: deleteProject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
