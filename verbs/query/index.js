var _ = require('underscore')
  , querystring = require('querystring');
module.exports = function(model) {
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
  return queryFunc;
}