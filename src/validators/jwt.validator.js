const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const xToken = req.header("x-token");

  if (!xToken) {
    return res.status(401).json({
      msg: "Se requiere 'x-token' - headers para esta solicitud.",
    });
  }

  try {
    const { uid } = jwt.verify(xToken, process.env.SECRETORPRIVATEKEY);
    const userLogged = await User.findById(uid);
    req.userLogged = userLogged;

    if (!userLogged) {
      return res.status(401).json({
        msg: "Token invalido - user eliminado de la BD",
      });
    }

    if (userLogged.deleted) {
      return res.status(401).json({
        msg: "Token invalido - user con { state : false }",
      });
    }

    // Sirve para continuar con el siguiente MIDDLEWARE
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token invalido",
    });
  }
};

module.exports = {
  validateJWT,
};
