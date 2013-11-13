var mongoose = require ('mongoose');
/**
 * Geese Collection
 * @type {Schema}
 */
var GooseSchema = new mongoose.Schema ({
  name: String,
  species: String,
  thumbnailURL: String,
  birthDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model ("Goose", GooseSchema);