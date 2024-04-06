const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

// Importando MODELOS
const User = require("../models/user.model");

// PARAMS http://localhost:8000/api/399
// BODY { name: "Rene", lastname: "Lozano" }
// QUERY http://localhost:8000/api/?index=10&page=24&code=lagarto

const getUsers = async (req = request, res = response) => {
  try {
    // TODO validar que los QUERYS solo sean numeros y no letras
    const { limit = 10, skip = 0 } = req.query;
    const query = { deleted: false }; // Solo los registros que no fueron borrados

    const [users, total] = await Promise.all([
      User.find(query).skip(parseInt(skip)).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      msg: "OK List Users",
      total,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const getOneUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, deleted: false });

    if (!user) {
      return res.status(404).json({
        msg: "ERROR User no encontrado.",
      });
    }

    res.status(200).json({
      msg: "OK",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const postUser = async (req = request, res = response) => {
  try {
    const { password, email, ...rest } = req.body;
    const user = new User({ password, email, ...rest });

    // Encriptando Password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardando la información en la BD
    await user.save();

    // Respuesta de la operacion
    res.status(200).json({
      msg: "OK User created",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const updateUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { password, email, ...rest } = req.body;

    // Encriptando el nuevo Password
    if (password) {
      const salt = bcryptjs.genSaltSync();
      rest.password = bcryptjs.hashSync(password, salt);
    }

    // Retorna la informacion anterior a la actualizacion
    const user = await User.findOneAndUpdate({ _id: id, deleted: false }, rest);

    if (!user) {
      return res.status(404).json({
        msg: "ERROR User no encontrado.",
      });
    }

    res.status(200).json({
      msg: "OK User Updated!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const deleteUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    // Aqui obtenemos la informacion del USER logeado mediante el TOKEN
    const { userLogged } = req;

    // Aqui si se elimina de la BD
    // const user = await User.findByIdAndDelete(id)

    // Cambiamos el DELETED del usuario para mantenerlo aun en la BD
    const user = await User.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true }
    );

    if (!user) {
      return res.status(404).json({
        msg: "ERROR User no encontrado.",
      });
    }

    res.status(200).json({
      msg: "OK User deleted",
      user,
      userLoggeduserLogged,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getOneUser,
  postUser,
  updateUser,
  deleteUser,
};
