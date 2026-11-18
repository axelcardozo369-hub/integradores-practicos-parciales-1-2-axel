// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { matchedData } from "express-validator";

export const register = async (req, res) => {
  try {
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    const { username, email, password, profile, role } = matchedData(req, {
      locations: ["body"],
    });
    const hasheoPassword = await hashPassword(password);
    // TODO: 2. Crear el user y su profile asociado.
    const newUser = await UserModel.create(
      {
        username,
        email,
        password: hasheoPassword,
        role,
        profile,
      },
      { include: [{ model: ProfileModel, as: "profile" }] },
    );
    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
    return res.status(201).json({
      message: "user registrado con exito",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req, { locations: ["body"] });

    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    const emailExiste = await UserModel.findOne({
      where: { email },
    });
    if (!emailExiste) {
      return res.status(401).json({ message: "credenciales incorrectas" });
    }
    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    const validarPassword = await comparePassword(
      password,
      emailExiste.password,
    );
    if (!validarPassword) {
      return res.status(401).json({
        message: "credenciales no fueron correctos",
      });
    }
    const token = signToken({
      id: emailExiste.id,
      role: emailExiste.role,
    });
    // TODO: 3. Guardar el token en una cookie httpOnly
    return (
      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60, // 1 hora
        })

        // TODO: 3llamada "token", responder con código 200 y un mensaje de éxito.
        .status(200)
        .json({ message: "login exitoso" })
    );
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
    return res.clearCookie("token").sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
