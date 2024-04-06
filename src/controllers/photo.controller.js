const { response, request } = require("express");

const Photo = require("../models/photo.model");
const PhotoHasLabelSchema = require("../models/photo-has-label.model");
const Label = require("../models/label.model");
const User = require("../models/user.model");

const getPhotos = async (req = request, res = response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const query = { deleted: false };

    // Obteniendo todas las Photo
    let [photos, total] = await Promise.all([
      Photo.find(query)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate("collection_id", "name"),
      Photo.countDocuments(query),
    ]);

    // Obteniendo los Labels de cada Photo
    photos = await Promise.all(
      photos.map(async (item) => {
        let labelsFromPhoto = [];

        // Accediendo al Modelo PhotoHasLabel
        labelsFromPhoto = await PhotoHasLabelSchema.find({
          photo_id: item._id,
        }).populate("label_id", "name");

        //Obteniendo el name and id Label
        labelsFromPhoto = labelsFromPhoto.map((item) => {
          return item.label_id;
        });

        return { ...item._doc, labels: labelsFromPhoto };
      })
    );

    res.status(200).json({
      msg: "OK List Photos.",
      total,
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

const getOnePhoto = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    // Obteniendo todas las Photo
    let photo = await Photo.findOne({ _id: id }).populate(
      "collection_id",
      "name"
    );

    if (!photo) {
      return res.status(400).json({
        msg: "ERROR Photo no encontrado.",
      });
    }

    // Obteniendo los Labels de cada Photo
    let labelsFromPhoto = [];

    // Accediendo al Modelo PhotoHasLabel
    labelsFromPhoto = await PhotoHasLabelSchema.find({
      photo_id: id,
    }).populate("label_id", "name");

    //Obteniendo el name and id Label
    labelsFromPhoto = labelsFromPhoto.map((item) => {
      return item.label_id;
    });

    photo = { ...photo._doc, labels: labelsFromPhoto };

    res.status(200).json({
      msg: "OK List Photos.",
      photo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const postPhoto = async (req = request, res = response) => {
  // Controlar la repiticion de Labels
  try {
    const { labels = [], ...rest } = req.body;

    const user = User.findOne({ _id: rest.user_id });

    if (!user) {
      res.status(400).json({
        msg: "ERROR El User no existe.",
      });
    }

    const photoObj = new Photo(rest);

    // Guardando Photo
    const photoResult = await photoObj.save();

    if (!photoResult) {
      res.status(400).json({
        msg: "ERROR Al registrar la Photo.",
      });
    }

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

    res.status(200).json({
      msg: "OK Saved.",
      photo: photoResult,
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const updatePhoto = async (req = request, res = response) => {
  // Controlar la repiticion de Labels
  try {
    const { id } = req.params;
    const { labels, ...rest } = req.body;

    // Update Photo and Id from collection
    const photo = await Photo.findByIdAndUpdate(id, rest);

    // Update Labels
    let labelsObj = await Label.find();
    labelsObj = labelsObj.map((item) => item._id.toString());

    if (!!labels) {
      labels.forEach((idLabel) => {
        if (!labelsObj.includes(idLabel)) {
          throw new Error(`The id: ${idLabel} label is incorrect!`);
        }
      });

      await PhotoHasLabelSchema.deleteMany({ photo_id: id });
      await Promise.all(
        labels.map(async (idLabel) => {
          const photoHasLabel = new PhotoHasLabelSchema({
            photo_id: id,
            label_id: idLabel,
          });
          return await photoHasLabel.save();
        })
      );
    }

    res.status(200).json({
      msg: "OK Photo updated",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const deletePhoto = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true }
    );

    if (!photo) {
      return res.status(404).json({
        msg: "ERROR Photo no encontrado.",
      });
    }

    res.status(200).json({
      msg: "OK Photo eliminado.",
      photo,
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
  getPhotos,
  getOnePhoto,
  postPhoto,
  updatePhoto,
  deletePhoto,
};
