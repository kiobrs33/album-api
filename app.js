const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./src/database/db-config");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || process.env.LOCAL_PORT; // Importando el puerto desde las VARIABLES de ENTORNO

    // El orden de ejecucion es IMPORTANTE!
    this.connectionDB();
    this.middleware();
    this.routes();
  }

  // Conexion a la base de datos
  async connectionDB() {
    await dbConnection();
  }

  // Middlewares - El orden de ejecución IMPORTANTE!
  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  // Rutas de la aplicacion
  routes() {
    this.app.use("/users", require("./src/routes/user.route"));
    this.app.use("/labels", require("./src/routes/label.route"));
    this.app.use("/auth", require("./src/routes/authentication.route"));
    this.app.use("/collections", require("./src/routes/collection.route"));
    this.app.use("/photos", require("./src/routes/photo.route"));
  }

  // Funcion para iniciar el SERVIDOR!
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server to in: ", this.port);
    });
  }
}

module.exports = App;
