const { Router } = require("express");
const {
  getPhotos,
  postPhoto,
  updatePhoto,
  deletePhoto,
  getOnePhoto,
} = require("../controllers/photo.controller");
const { validateJWT, validateFields } = require("../validators");
const { check } = require("express-validator");

const router = Router();

router.get("/", [validateJWT], getPhotos);
router.get(
  "/:id/labels",
  [
    validateJWT,
    check("id", "El 'id' es incorrecto.").isMongoId(),
    validateFields,
  ],
  getOnePhoto
);
router.post(
  "/",
  [
    validateJWT,
    check("title", "El 'title' es requerido.").not().isEmpty(),
    check("url_image", "El 'url_image' es requerido.").not().isEmpty(),
    check("user_id", "El 'user_id' es incorrecto.").isMongoId(),
    validateFields,
  ],
  postPhoto
);
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "El 'id' es incorrecto.").isMongoId(),
    validateFields,
  ],
  updatePhoto
);
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "El 'id' es incorrecto.").isMongoId(),
    validateFields,
  ],
  deletePhoto
);

module.exports = router;
