const validateFieldsCollection = (value = {}) => {
  if (!value.name) {
    throw new Error("El campo 'collection.name' collection es requerido.");
  }
  if (!value.user_id) {
    throw new Error("El campo 'collection.user_id' es requerido.");
  }
  return true;
};

module.exports = {
  validateFieldsCollection,
};
