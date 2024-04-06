const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

const {
  postLogin,
  postLoginGoogle,
} = require("../controllers/authentication.controller");

const { validateFields } = require("../validators");

router.post(
  "/login",
  [
    check("email", "El email no es valido").isEmail(),
    check("password", "El passowrd es invalido").not().isEmpty(),
    validateFields,
  ],
  postLogin
);

router.post(
  "/login-google",
  [
    check("id_token", "El id_token de google es necesario").not().isEmpty(),
    validateFields,
  ],
  postLoginGoogle
);
module.exports = router;
