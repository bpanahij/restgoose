/**
 * Dependencies
 * @type {exports}
 */
var fs = require('fs')
  , q = require('q')
  , _ = require('underscore')
  , path = require('path')
  , natural = require('natural')
  , nounInflector = new natural.NounInflector()
  , argv = require('optimist').argv
  , path = require('path')
  , generator = require('./model.generator');
/**
 * Arguments
 */
var directory = path.resolve(process.argv[2])
  , dest = path.resolve(process.argv[3]);
var host = ""
  , version = "1.0"
  , rel = "";
/**
 * Functions
 */
var resourceName = function(model) {
  return nounInflector.pluralize(model.modelName).toLowerCase();
};
/**
 * load a model
 * @param modelPath
 * @returns {*}
 */
var loadModel = function(modelPath) {
  return require(directory + '/' + modelPath);
};
/**
 * Write the schema file
 * @param modelPath
 */
var profileModel = function(modelPath) {
  var model = loadModel(modelPath);
  var schema = generator(host, version, model, rel);
  mkdir(dest)
  fs.writeFile(dest + '/' + resourceName(model) + '.json', JSON.stringify(schema, false, 2), function(err) {
  });
};
/**
 * Read models from directory
 */
fs.readdir(directory, function(err, files) {
  _.each(files, profileModel);
});
/**
 * Make a directory
 * @param path
 * @param root
 * @returns {boolean|*}
 */
function mkdir(path, root) {
  var dirs = path.split('/')
    , dir = dirs.shift()
    , root = (root || '') + dir + '/';
  try {
    fs.mkdirSync(root);
  }
  catch(e) {
    if (!fs.statSync(root).isDirectory()) {
      throw new Error(e);
    }
  }
  return !dirs.length || mkdir(dirs.join('/'), root);
}