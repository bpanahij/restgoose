var mongoose = require ('mongoose');
/**
 * News Story Collection
 * @type {Schema}
 */
var NewsSchema = new mongoose.Schema ({
  title: String,
  body: String,
  thumbnailURL: String,
  createdDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model ("News", NewsSchema);