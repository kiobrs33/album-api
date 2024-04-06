const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

const {
  getCollections,
  postCollection,
  postCollectionAndPhotos,
  updateCollection,
  deleteCollection,
  getOneCollection,
  deleteCollectionAndPhotos,
} = require("../controllers/collection.controller");
const { validateFields, validateJWT } = require("../validators");
const {
  validateFieldsCollection,
} = require("../validators/collection.validator");

// ROUTES
router.get("/", [validateJWT], getCollections);
router.get(
  "/:id/photos/labels",
  [
    validateJWT,
    check("id", "No es un 'id' valido.").isMongoId(),
    validateFields,
  ],
  getOneCollection
);
router.post(
  "/",
  [
    validateJWT,
    check("name", "El 'name' collection es requerido.").not().isEmpty(),
    check("user_id", "No es un 'id' válido.").isMongoId(),
    validateFields,
  ],
  postCollection
);
router.post(
  "/photos",
  [
    validateJWT,
    check("collection").custom(validateFieldsCollection).optional().isObject(),
    check("photos", "Debe haber 1 photo como mínimo.").isArray({
      min: 1,
    }),
    validateFields,
  ],
  postCollectionAndPhotos
);
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un 'id' valido.").isMongoId(),
    validateFields,
  ],
  updateCollection
);
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un 'id' valido.").isMongoId(),
    validateFields,
  ],
  deleteCollection
);
router.delete(
  "/:id/photos/labels",
  [
    validateJWT,
    check("id", "No es un 'id' valido.").isMongoId(),
    validateFields,
  ],
  deleteCollectionAndPhotos
);

module.exports = router;
