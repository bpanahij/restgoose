/**
 * Dependencies
 */
var fs = require('fs')
  , q = require('q')
  , _ = require('underscore')
  , argv = require('optimist').argv
  , path = require('path')
  , resourceName = require('./helpers/resourceName')
/**
 */
var links = function(resource_path, models) {
  var links = [{
    rel: 'self',
    href: resource_path
  }];
  _.each(models, function(model) {
    links.push({
      rel: resourceName(model),
      href: path.join(resource_path, resourceName(model))
    });
  });
  return links;
};
/**
 *
 */
module.exports = function(resource_path, models) {
  var schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": 'root',
    "name": 'root',
    "description": "PassportEDU API Schema",
//    "properties": getProperties(models),
    "links": links(resource_path, models)
  };
  return schema;
};