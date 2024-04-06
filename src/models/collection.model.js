const { Schema, model } = require("mongoose");
const User = require("./user.model");

const CollectionSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "The name collection is required."],
    },
    description: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

CollectionSchema.methods.toJSON = function () {
  const { deleted, ...collection } = this.toObject();
  return collection;
};

module.exports = model("Collection", CollectionSchema);
