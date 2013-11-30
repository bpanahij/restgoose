var express = require('express')
  , api = express()
  , http = require('http')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , querystring = require('querystring');

api.use(express.methodOverride());
/**
 * Parse the JSON body
 */
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
      var query = {
        _id: req.params.id
      };
      query = _.extend(query, req.restrictQuery);
      model.find(query, function(err, gotModel) {
        res.json(gotModel);
      });
    };
    /**
     * RESTful query
     */
    var queryFunc = function(req, res) {
      var parentRoute = req.app.route
        , queryVars = _.extend(req.query, req.restrictQuery)
        , query = model.find();
      advancedQueries(query, queryVars);
      var pagelessQuery = query.toConstructor()
        , limit = queryVars.limit
        , offset = queryVars.offset;
      // Later is now, handle limit and offset
      if (_.isUndefined(limit)) {
        queryVars.limit = limit = 10;
      }
      query.limit(limit);
      if (_.isUndefined(offset)) {
        queryVars.offset = offset = 0;
      }
      query.skip(offset);
      query.exec(function(err, result) {
        if (err) {
          res.json({error: err});
          return;
        }
        // Count total results
        pagelessQuery().count().exec(function(err, count) {
          queryVars.limit = Number(limit);
          var nextPage = _.clone(queryVars)
            , prevPage = _.clone(queryVars)
            , nextOffset = Number(offset) + Number(limit)
            , prevOffset = Number(offset) - Number(limit)
            , meta = {};
          if (nextOffset <= (count - 1)) {
            nextPage.offset = nextOffset;
            meta.nextPageURL = parentRoute + '/' + model.modelName + '?' + querystring.stringify(nextPage);
            meta.nextPageQuery = nextPage;
          }
          if (prevOffset > 0) {
            prevPage.offset = prevOffset;
            meta.prevPageURL = parentRoute + '/' + model.modelName + '?' + querystring.stringify(prevPage);
            meta.prevPageQuery = prevPage;
          }
          meta.count = count;
          meta.pages = Math.ceil(count / limit);
          meta.page = Math.ceil(offset / limit) + 1;
          res.json({
            meta: meta,
            result: result
          });
        });
      });
    };
    var advancedQueries = function(query, queryVars) {
      _.each(queryVars, function(value, key) {
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
        else if (key.match('limit') || key.match('offset')) {
          // skip limit and offset for later
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
      var body = _.extend(req.body, req.restrictQuery);
      if (!_.isUndefined(body._id)) {
        // Escape into put functionality when there exists a resource id
        putFunc(req, res);
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
      var body = _.extend(req.body, req.restrictQuery);
      var savedModel = new model(body);
      var upsertData = savedModel.toObject();
      delete upsertData._id;
      model.update({_id: savedModel._id}, upsertData, {}, function(err) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json(savedModel);
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
    var putEnd = '/' + model.modelName;
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
