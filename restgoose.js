/**
 * resting-mongoose
 * by Brian Johnson
 */
var express = require('express')
  , api = express()
  , http = require('http')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , UserModel = require('./models/User');
// Enable PUT, DELETE
api.use(express.methodOverride());
// Compress responses
api.use(express.compress());
// Parse the JSON body
api.use(express.bodyParser());
/**
 * Building endpoints for Mongoose Models:
 * - get
 * - query
 * - post
 * - put
 * - delete
 */
var buildEndpoints = function(modelDir) {
  fs.readdir(modelDir, function(err, files) {
    _.each(files, restModel);
  });
  var loadModel = function(modelPath) {
    return require(modelDir + '/' + modelPath);
  };
  var restModel = function(modelPath) {
    var model = loadModel(modelPath);
    /**
     * Restful GET
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
    /**
     * Restful QUERY
     */
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
     */
    var putFunc = function(req, res) {
      var body = req.body;
      var savedModel = new model(body);
      var upsertData = savedModel.toObject();
      delete upsertData._id;
      model.update({_id: savedModel._id}, upsertData, {upsert: true}, function(err) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json(savedModel);
      });
    };
    /**
     * Restful DELETE
     */
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
     * Authenticate a user with username/password
     * @param req
     * @param res
     */
    var login = function(req, res) {
      UserModel.login({
        username: req.body.username,
        password: req.body.password
      }, function(err, token) {
        res.json({
          token: token
        });
      });
    };
    /**
     * Authenticate with token
     * @param req
     * @param res
     */
    var authenticate = function(req, res, next) {
      UserModel.auth(req.params.token, function(err, User) {
        if (err || _.isNull(User)) {
          res.json({
            meta: {
              success: false,
              statusCode: 420
            }
          });
          return;
        }
        next();
      });
    };
    /**
     * Binding endpoints
     */
    var getEnd = '/v2/' + model.modelName + '/:id';
    var queryEnd = '/v2/' + model.modelName;
    var postEnd = '/v2/' + model.modelName;
    var putEnd = '/v2/' + model.modelName + '/:id';
    var deleteEnd = '/v2/' + model.modelName + '/:id';
    api.get(getEnd, getFunc);
    api.get(queryEnd, queryFunc);
    api.post(postEnd, postFunc);
    api.put(putEnd, putFunc);
    api.delete(deleteEnd, deleteFunc);
    api.get('/v2/authenticate', authenticate);
  };
  return(api);
};
/**
 * Exporting API...
 */
module.exports = buildEndpoints;
