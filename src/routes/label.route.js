const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();
const {
  getLabels,
  postLabel,
  putLabel,
  deleteLabel,
} = require("../controllers/label.controller");
const { validateJWT, isAdminRol, validateFields } = require("../validators");

// ROUTES
router.get("/", [validateJWT], getLabels);
router.post(
  "/",
  [
    validateJWT,
    isAdminRol,
    check("name", "El 'name' es requerido.").not().isEmpty(),
    validateFields,
  ],
  postLabel
);
router.put("/:id", [validateJWT, isAdminRol], putLabel);
router.delete("/:id", [validateJWT, isAdminRol], deleteLabel);

module.exports = router;
