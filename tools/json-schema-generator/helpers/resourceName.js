/**
 *
 * Pluralize a model Name into a resource
 */
var natural = require('natural')
  , nounInflector = new natural.NounInflector();
module.exports = function(model) {
  return nounInflector.pluralize(model.modelName).toLowerCase();
};