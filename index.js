/*
 Dependencies
 */
var express = require('express')
  , api = express()
  , _ = require('underscore')
  , fs = require('fs')
  , q = require('q')
  , path = require('path')
  , resourceName = require('./tools/json-schema-generator/helpers/resourceName')
  , root_generator = require('./tools/json-schema-generator/root.generator.js')
/*
 VERB modules
 */
var optionsM = require('./verbs/options')
  , getM = require('./verbs/get')
  , queryM = require('./verbs/query')
  , postM = require('./verbs/post')
  , putM = require('./verbs/put')
  , deleteM = require('./verbs/delete')
  , headM = require('./verbs/head');
/*
 Configuration
 */
var config = {};
/*
 Utility methods
 */
var loadModels = function(modelDir, callback) {
  var models = [];
  fs.readdir(modelDir, function(err, files) {
    for(file in files) {
      models.push(require(modelDir + '/' + files[file]));
    }
    callback(null, models);
  });
};
/**
 * Parse the JSON body
 */
api.use(express.bodyParser());
/**
 * Main method
 */
var rest = function(modelDir, configuration) {
  config = configuration,
    resource_path = '/' + path.join(config.version, config.rel);
  loadModels(modelDir, function(err, models) {
    var rootSchema = root_generator(resource_path, models);
    api.options(resource_path, function(req, res) {
      res.json(rootSchema);
    });
    _.each(models, function(model) {
      var model_path = path.join(resource_path, resourceName(model))
        , model_path_id = path.join(resource_path, resourceName(model), ':id');
      api.options(model_path, optionsM(resource_path, model));
      api.options(model_path_id, optionsM(resource_path, model));
      api.get(model_path_id, getM(model));
      api.get(model_path, queryM(model));
      api.put(model_path_id, putM(model));
      api.post(model_path, postM(model));
      api.delete(model_path_id, deleteM(model));
      //      api.head('*', headM(models));
    });
  });
  return api;
};
module.exports = rest;