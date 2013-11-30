var mongoose = require('mongoose');
/**
 * Geese Collection
 */
var GooseSchema = new mongoose.Schema({
  name: String,
  species: String,
  thumbnailURL: String,
  birthDate: { type: Date, default: Date.now }
});
/*
  export schema model
 */
var model = mongoose.model("Goose", GooseSchema);
model.prompts = {
  name: 'Goose Name',
  species: 'Species',
  thumbnailURL: 'Thumbnail Image',
  birthDate: 'Birth Date'
};
module.exports = model;
