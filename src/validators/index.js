const jwtValidator = require("../validators/jwt.validator");
const expressValidator = require("../validators/express.validator");
const dataValidator = require("../validators/data.validator");
const roleValidator = require("../validators/role.validator");

module.exports = {
  ...jwtValidator,
  ...expressValidator,
  ...dataValidator,
  ...roleValidator,
};
