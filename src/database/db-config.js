const mongoose = require("mongoose");

// TODO: No olvidar! Agregar el IP local de la PC para conectarse a MONGO DB

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_SRV);
    console.log("Base de datos Online!");
  } catch (error) {
    console.log(error);
    throw new Error("Error al inicializar la conexion con la base de datos!");
  }
};

module.exports = { dbConnection };
