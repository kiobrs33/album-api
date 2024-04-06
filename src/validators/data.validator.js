// MODELOS
const { userRoles } = require("../data/data");
const User = require("../models/user.model");

const validateRol = async (role = "") => {
  const existRol = userRoles.includes(role);
  if (!existRol) {
    throw new Error(`El 'rol' ${role} no existe en la base datos.`);
  }
};

const validateExistEmail = async (email = "") => {
  const isThereEmail = await User.findOne({ email });
  if (isThereEmail) {
    throw new Error(`El email: ${email} ya existe.`);
  }
};

const validateExistIdUser = async (id = "") => {
  const isThereId = await User.findById(id);

  if (!isThereId) {
    throw new Error(`El 'id' del usuario no existe.`);
  }
};

module.exports = {
  validateRol,
  validateExistEmail,
  validateExistIdUser,
};
