const { Schema, model } = require("mongoose");
const { userRoles } = require("../data/data");

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
    },
    lastname: {
      type: String,
      required: [true, "The lastname is required"],
    },
    email: {
      type: String,
      required: [true, "The email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "The password is required"],
    },
    url_image: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      emun: userRoles,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    is_logged_google: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Customizando un metodo de la INSTANCIA para alterar los datos que retorna despues de GUARDAR
UserSchema.methods.toJSON = function () {
  const { password, _id, deleted, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
