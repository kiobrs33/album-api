const { Schema, model } = require("mongoose");

const LabelSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "The name label is required."],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

LabelSchema.methods.toJSON = function () {
  const { deleted, ...label } = this.toObject();
  return label;
};

module.exports = model("Label", LabelSchema);
