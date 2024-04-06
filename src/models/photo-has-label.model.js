const { Schema, model } = require("mongoose");

const Photo = require("./photo.model");
const Label = require("./label.model");

const PhotoHasLabelSchema = Schema(
  {
    photo_id: {
      type: Schema.Types.ObjectId,
      ref: Photo,
      required: [true, "The id photo is required."],
    },
    label_id: {
      type: Schema.Types.ObjectId,
      ref: Label,
      required: [true, "The id label is required."],
    },
  },
  { timestamps: true }
);

module.exports = model("PhotoHasLabel", PhotoHasLabelSchema);
