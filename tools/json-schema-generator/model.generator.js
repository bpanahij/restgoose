/**
 * Dependencies
 * @type {exports}
 */
var q = require('q')
  , _ = require('underscore')
  , path = require('path')
  , resourceName = require('./helpers/resourceName')
/**
 * Get the name of a function, without invoking it
 * @param fun
 * @returns {*}
 */
var functionName = function(fun) {
  if (_.isUndefined(fun)) {
    return 'String';
  }
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
};
/**
 * Converting Mongoose model paths & schema into Collection+JSON data
 * @param model
 * @param types
 * @param postFix
 * @param description
 * @returns {{}}
 */
var getProperties = function(model, types, postFix, description) {
  var data = {}
    , schemas = model.schema.paths;
  postFix = _.isUndefined(postFix) ? '' : postFix;
  description = _.isUndefined(description) ? '' : description;
  for(mpath in schemas) {
    if (mpath == '__v') {
      continue;
    }
    var schema = schemas[mpath];
    var type = functionName(schema.options.type);
    if (types.length > 0 && !_.contains(types, type)) {
      continue;
    }
    var d = {
      title: mpath,
      description: mpath + ' ' + description,
      identity: mpath == '_id' ? true : false,
      readonly: mpath == '_id' ? true : false
      //      required: true
    };
    if (type == 'String') {
      //      d.maxLength = 100;
      //      d.minLength = 0;
    }
    switch(type) {
      case 'Date':
        type = 'date-time';
        break;
      case 'ObjectId':
        type = 'string';
        break;
      case 'Mixed':
        type = 'any';
        break;
      case 'Boolean':
        type = 'boolean';
        break;
      default:
        type = type.toLowerCase()
    }
    d.type = type;
    if (!_.isEmpty(schema.enumValues)) {
      d.enum = schema.enumValues;
      d.type = "string";
    }
    data[mpath + postFix] = d;
  }
  return data;
};
/**
 * Converting model to Collection+JSON Template
 * @param model
 * @returns {Array}
 */
var getLinks = function(resource_path, model) {
  var data = []
    , schemas = model.schema.paths;
  data.push({
    rel: "self",
    href: path.join(resource_path, resourceName(model))
  });
  var equalTo = getProperties(model, ['Number', 'Date', 'String', 'Boolean', 'Mixed'], '', 'is equal to');
  var lookAhead = getProperties(model, ['String'], '*', 'contains');
  var greaterThan = getProperties(model, ['Number', 'Date', 'String'], '>', 'is greater than');
  var lessThan = getProperties(model, ['Number', 'Date', 'String'], '<', 'is less than');
  var notEqual = getProperties(model, ['Number', 'Boolean', 'String'], '!', 'is not equal to');
  var paging = {
    offset: {
      title: "offset",
      description: 'Offset to start with',
      required: false,
      type: "number"
    },
    limit: {
      title: "limit",
      description: 'Number of items to return',
      required: false,
      type: "number"
    }
  }
  var properties = _.extend({}, paging, equalTo, lookAhead, greaterThan, lessThan, notEqual);
  data.push({
    rel: "instances",
    href: path.join(resource_path, resourceName(model)),
    properties: properties
  });
  data.push({
    title: 'Create a ' + model.modelName,
    rel: "create",
    href: path.join(resource_path, resourceName(model)),
    properties: getProperties(model, ['String', 'Number', 'Date', 'Mixed', 'Boolean'])
  });
  data.push({
    rel: "destroy",
    href: path.join(resourceName(model), "{_id}"),
    method: "DELETE"
  })
  data.push({
    title: 'Update a ' + model.modelName,
    rel: "update",
    href: path.join(resource_path, resourceName(model), "{_id}"),
    properties: getProperties(model, ['String', 'Number', 'Date', 'Mixed', 'Boolean']),
    method: "PUT"
  });
  data.push({
    rel: "root",
    href: "#/result"
  })
  return data;
};
/**
 *
 * @param model_path
 * @param model
 * @returns {{$schema: string, type: string, title: *, name: *, description: string, properties: {}, links: Array}}
 */
var generateSchema = function(model_path, model) {
  var links = getLinks(model_path, model);
  return {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": resourceName(model),
    "name": resourceName(model),
    "description": "",
    "properties": getProperties(model, []),
    "links": links
  };
};
/**
 * Exporting functionality
 * @type {Function}
 */
module.exports = generateSchema;
