const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();
const {
  getUsers,
  getOneUser,
  postUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

const {
  validateRol,
  hasRol,
  validateJWT,
  validateExistEmail,
  validateFields,
  validateExistIdUser,
} = require("../validators");

const { allowedUsers } = require("../data/data");

// RUTAS
router.get("/", [validateJWT], getUsers);
router.get("/:id", [validateJWT], getOneUser);
router.post(
  "/",
  [
    check("name", "El 'name' es requerido.").not().isEmpty(),
    check("lastname", "El 'lastname' es requerido.").not().isEmpty(),
    check("role", "El 'role' es requerido.").not().isEmpty(),
    check("role").custom(validateRol),
    check("email", "El 'email' no es valido.").isEmail(),
    check("email").custom(validateExistEmail),
    check("password", "El 'password' debe tener más de 6 caracteres").isLength(
      6
    ),
    validateFields,
  ],
  postUser
);
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un 'id' valido.").isMongoId(),
    check("id").custom(validateExistIdUser),
    check("role").custom(validateRol).optional(),
    validateFields,
  ],
  updateUser
);
router.delete(
  "/:id",
  [
    validateJWT,
    hasRol(...allowedUsers),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(validateExistIdUser),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
