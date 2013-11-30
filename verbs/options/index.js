var schema_gen = require('../../tools/json-schema-generator/model.generator');
/**
 * OPTIONS Verb
 * @param req
 * @param res
 */
module.exports = function(resource_path, model) {
  var optionsFunc = function(req, res) {
    var schema = schema_gen(resource_path, model);
    res.set('Content-Type', 'application/json');
    res.json(schema);
  };
  return optionsFunc;
}