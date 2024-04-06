const { Schema, model } = require("mongoose");

const Collection = require("./collection.model");
const User = require("./user.model");

const PhotoSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "The title is required."],
    },
    description: {
      type: String,
    },
    url_image: {
      type: String,
      required: [true, "The url image is required."],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    collection_id: {
      type: Schema.Types.ObjectId,
      ref: Collection,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "The user_id image is required."],
    },
  },
  { timestamps: true }
);

PhotoSchema.methods.toJSON = function () {
  const { deleted, ...photo } = this.toObject();
  return photo;
};

module.exports = model("Photo", PhotoSchema);
