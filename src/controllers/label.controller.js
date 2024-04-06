const { response, request } = require("express");

// MODELOS
const Label = require("../models/label.model");

const getLabels = async (req = request, res = response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const query = { deleted: false };

    const [labels, total] = await Promise.all([
      Label.find(query).skip(parseInt(skip)).limit(parseInt(limit)),
      Label.countDocuments(query),
    ]);

    res.status(200).json({
      msg: "OK Lista de labels",
      total,
      labels,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const postLabel = async (req = request, res = response) => {
  try {
    const body = req.body;
    const label = new Label(body);

    await label.save();

    res.status(200).json({
      msg: "OK Label creado.",
      label,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const putLabel = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const label = await Label.findOneAndUpdate(
      { _id: id, deleted: false },
      body
    );

    if (!label) {
      return res.status(404).json({
        msg: "ERROR 'id' del Label no encontrado.",
      });
    }

    res.status(200).json({
      msg: "OK Label actualizado.",
      label,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "ERROR",
      error: error.message,
    });
  }
};

const deleteLabel = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const label = await Label.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true }
    );

    if (!label) {
      return res.status(404).json({
        msg: "ERROR 'id' del Label no encontrado.",
      });
    }

    res.status(200).json({
      msg: "OK Label eliminado.",
      label,
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
  getLabels,
  postLabel,
  putLabel,
  deleteLabel,
};
