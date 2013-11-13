/**
 * See MIT License *in footer
 *
 */
var express = require('express')
  , api = express()
  , http = require('http')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , _ = require('underscore');
/**
 * Connect with Mongo DB
 */
api.use(express.methodOverride());
/**
 * Parse the JSON body
 */
var secret = 'Passport is your ticket to better colleges and students.';
api.use(express.compress());
api.use(express.bodyParser());
/**
 * Building endpoints for Mongoose Models:
 * - get
 * - query
 */
var buildEndpoints = function(modelDir) {
  fs.readdir(modelDir, function(err, files) {
    _.each(files, restModel);
  });
  var loadModel = function(modelPath) {
    return require(modelDir + '/' + modelPath);
  }
  var restModel = function(modelPath) {
    var model = loadModel(modelPath);
    /**
     * Restful GET
     * @param req
     * @param res
     */
    var getFunc = function(req, res) {
      model.findById(req.params.id, function(err, gotModel) {
        res.json(gotModel);
      });
    };
    var queryFunc = function(req, res) {
      var query = model.find();
      advancedQueries(query, req.query);
      query.exec(function(err, result) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json(result);
      });
    };
    var advancedQueries = function(query, queries) {
      _.each(queries, function(value, key) {
        if (key.match(/>/)) {
          var cleanKey = key.replace(/>/, '');
          query.gte(cleanKey, value);
        }
        else if (key.match(/</)) {
          var cleanKey = key.replace(/</, '');
          query.lte(cleanKey, value);
        }
        else if (key.match(/\*/)) {
          var cleanKey = key.replace(/\*/, '');
          var regStr = "^(?=.*\\b" + value.split(' ').join("\\b)(?=.*\\b") + "\\b)";
          var reg = new RegExp(regStr, 'i');
          query.regex(cleanKey, reg);
        }
        else if (key.match('limit')) {
          query.limit(value);
        }
        else if (key.match('offset')) {
          query.skip(value);
        }
        else if (key.match(/\!/)) {
          var cleanKey = key.replace(/\!/, '');
          query.ne(cleanKey, value);
        }
        else {
          query.where(key, value);
        }
      });
    };
    /**
     * Restful POST (Create)
     * @param req
     * @param res
     */
    var postFunc = function(req, res) {
      var body = req.body;
      if (body._id) {
        res.json({error: 'Object must be a new ' + model.modelName});
        return;
      }
      var newModel = new model(body);
      newModel.save(function(err) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json(newModel);
      });
    };
    /**
     * Restful PUT (Save)
     * @param req
     * @param res
     */
    var putFunc = function(req, res) {
      var body = req.body;
      var savedModel = new model(body);
      var upsertData = savedModel.toObject();
      delete upsertData._id;
      model.update ({_id: savedModel._id}, upsertData, {upsert: true}, function (err) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json (savedModel);
      });
    };
    var deleteFunc = function(req, res) {
      model.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json(req.params.id);
      });
    };
    /**
     * Binding endpoints
     */
    var getEnd = '/' + model.modelName + '/:id';
    var queryEnd = '/' + model.modelName;
    var postEnd = '/' + model.modelName;
    var putEnd = '/' + model.modelName + '/:id';
    var deleteEnd = '/' + model.modelName + '/:id';
    api.get(getEnd, getFunc);
    api.get(queryEnd, queryFunc);
    api.post(postEnd, postFunc);
    api.put(putEnd, putFunc);
    api.delete(deleteEnd, deleteFunc);
  };
  return(api);
};
/**
 * Exporting API to app.js
 * @type {*|exports}
 */
module.exports = buildEndpoints;
