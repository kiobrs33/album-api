const { request, response } = require("express");

const Collection = require("../models/collection.model");
const Photo = require("../models/photo.model");
const PhotoHasLabelSchema = require("../models/photo-has-label.model");
const User = require("../models/user.model");

const getCollections = async (req = request, res = response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const query = { deleted: false };

    const [collections, total] = await Promise.all([
      Collection.find(query).skip(parseInt(skip)).limit(parseInt(limit)),
      Collection.countDocuments(query),
    ]);

    res.status(200).json({
      msg: "OK Lista de Collections",
      total,
      collections,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const getOneCollection = async (req = request, res = response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const { id } = req.params;
    const queryPhoto = {
      collection_id: id,
      deleted: false,
    };

    // TODO Mejorar
    let [collection, photos, total_photos] = await Promise.all([
      Collection.findOne({ _id: id, deleted: false }),
      Photo.find(queryPhoto).skip(parseInt(skip)).limit(parseInt(limit)),
      Photo.countDocuments(queryPhoto),
    ]);

    if (!collection) {
      return res.status(400).json({
        msg: "ERROR Collection no encotrada.",
      });
    }

    photos = await Promise.all(
      photos.map(async (item) => {
        // Obteniendo los Labels de cada Photo
        let labelsFromPhoto = [];

        // Accediendo al Modelo PhotoHasLabel
        labelsFromPhoto = await PhotoHasLabelSchema.find({
          photo_id: item._id,
        }).populate("label_id", "name");

        //Obteniendo el name and id Label
        labelsFromPhoto = labelsFromPhoto.map((item) => {
          return item.label_id;
        });

        item = { ...item._doc, labels: labelsFromPhoto };
        return item;
      })
    );

    if (!collection) {
      return res.status(400).json({
        msg: "ERROR Collection no encontrada.",
      });
    }

    collection = { ...collection._doc, total_photos };

    res.status(200).json({
      msg: "OK",
      collection,
      photos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const postCollection = async (req = request, res = response) => {
  try {
    const body = req.body;
    const collection = new Collection(body);

    await collection.save();

    res.status(200).json({
      msg: "OK Label creado.",
      collection,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const postCollectionAndPhotos = async (req = request, res = response) => {
  try {
    // TODO Controlar la repiticion de Labels
    const { collection = {}, photos = [] } = req.body;

    let collectionResult = {};
    let photosResult = [];
    let collectionObj = null;
    let idCollection = null;

    const user = User.findOne({ _id: collection.user_id });
    if (!user) {
      res.status(400).json({
        msg: "ERROR El User no existe.",
      });
    }

    // Verificando si la COLLECTION tiene datos
    if (Object.keys(collection).length > 0) {
      // Aqui se guarda la COLLECTION
      collectionObj = new Collection(collection);
      collectionResult = await collectionObj.save();

      // Aqui se obtiene el ID de la Collection CREADA
      idCollection = collectionObj._id;
    }

    // Recorriendo y guardando las PHOTOS
    photosResult = await Promise.all(
      photos.map(async (item) => {
        const {
          title = "",
          description = "",
          url_image = "",
          labels = [],
        } = item;

        let photoResult;

        const photoObj = new Photo({
          title,
          description,
          url_image,
          collection_id: idCollection,
          user_id: collection.user_id,
        });

        // Guardando PHOTO
        photoResult = await photoObj.save();

        // TODO
        await Promise.all(
          labels.map(async (idLabel) => {
            const photoHasLabel = new PhotoHasLabelSchema({
              photo_id: photoResult._id,
              label_id: idLabel,
            });
            // Guardando los Labels de cada Photo
            return await photoHasLabel.save();
          })
        );

        return photoResult;
      })
    );

    res.status(200).json({
      msg: "OK Saved.",
      collection: collectionResult,
      photos: photosResult,
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const updateCollection = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const collection = await Collection.findByIdAndUpdate(id, body);

    if (!collection) {
      return res.status(404).json({
        msg: "ERROR 'id' de la Collection no encontrada.",
      });
    }

    res.status(200).json({
      msg: "OK Collection actualizado.",
      collection,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const deleteCollection = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true }
    );

    if (!collection) {
      return res.status(404).json({
        msg: "ERROR Collection no encontrado.",
      });
    }

    const photos = await Photo.updateMany(
      { collection_id: id },
      { collection_id: null }
    );

    res.status(200).json({
      msg: "OK Collection eliminado.",
      collection,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const deleteCollectionAndPhotos = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true }
    );

    if (!collection) {
      return res.status(404).json({
        msg: "ERROR Collection no encontrado.",
      });
    }

    const photos = await Photo.updateMany(
      { collection_id: id },
      { collection_id: null, deleted: true }
    );

    res.status(200).json({
      msg: "OK Collection eliminado.",
      collection,
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
  getCollections,
  getOneCollection,
  postCollection,
  postCollectionAndPhotos,
  updateCollection,
  deleteCollection,
  deleteCollectionAndPhotos,
};
