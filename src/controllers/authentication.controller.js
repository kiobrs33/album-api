const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");

const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const postLogin = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    // Verifica si el email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "El passowrd o email son incorrectos - email",
      });
    }

    // Verifica si el USER aún existe o fue eliminado
    if (user.deleted) {
      return res.status(400).json({
        msg: "El passowrd o email son incorrectos - { deleted :  true }",
      });
    }

    // Verificar el password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "El passowrd o email son incorrectos - password",
      });
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.status(200).json({
      msg: "OK User logged",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const postLoginGoogle = async (req = request, res = response) => {
  try {
    const { id_token } = req.body;

    // ID_TOKEN generado por google verify
    const { name, lastname, picture, email } = await googleVerify(id_token);
    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        lastname,
        email,
        password: "",
        url_img: picture,
        role: "CLIENT_ROL",
        is_logged_google: true,
      };

      // Aqui se esta guardando el User directamente en la BD - Mongo
      // La contraseña es VACIA y no esta siendo ENCRIPTADA
      // El usuario debera actualizar la contraseña, pero de esta APLICACION
      user = new User(data);
      await user.save();
    }

    if (user.deleted) {
      return res.status(401).json({
        msg: "User bloqueado o eliminado, hable con el Administrador.",
      });
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.status(200).json({
      msg: "OK Sign Google exitoso.",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "El token no se pudo verificar.",
    });
  }
};

module.exports = {
  postLogin,
  postLoginGoogle,
};
